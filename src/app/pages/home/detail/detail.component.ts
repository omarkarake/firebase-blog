import { ModalService } from './../../../services/modal/modal.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BlogfireService } from '../../../services/blogfire/blogfire.service';
import { ActivatedRoute } from '@angular/router';
import { Blog } from '../../../models/blog.model';
import { Comment } from '../../../models/comment.model';
import { Observable } from 'rxjs';
import { Location } from '@angular/common';
import { MetaService } from '../../../services/meta.service';
import { Analytics, logEvent } from '@angular/fire/analytics';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css'],
})
export class DetailComponent implements OnInit {
  blog!: Blog | null; // Blog can be null initially
  comments$!: Observable<Comment[]>;
  commentForm!: FormGroup;
  id: string = '';
  isLiked: boolean = false;

  constructor(
    private fb: FormBuilder,
    private blogfireService: BlogfireService,
    private route: ActivatedRoute,
    private location: Location,
    private modalService: ModalService,
    private metaService: MetaService,
    private analytics: Analytics
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];

    // Subscribe to the blog observable
    this.blogfireService.blog$.subscribe((blog) => {
      this.blog = blog;
      console.log('Fetched blog:', blog);
      logEvent(this.analytics, 'page_view', { page_path: `/blog/${this.id}` });
      if (blog) {
        // Update meta tags dynamically based on the blog data
        this.metaService.updateMetaTags({
          title: blog.title,
          description: blog.description,
          image: blog.image,
          url: window.location.href,
        });

        // Inject structured data (JSON-LD) for the blog post
        this.metaService.setStructuredData({
          title: blog.title,
          description: blog.description,
          author: blog.author,
          date: new Date().toISOString(), // Assuming datePublished is current date
          image: blog.image,
          url: window.location.href
        });
      }
      // Update meta tags dynamically based on the blog data
    });

    // Fetch the blog by its ID initially
    this.blogfireService.getBlogById(this.id);

    // Initialize the comment form
    this.commentForm = this.fb.group({
      author: ['', [Validators.required, Validators.minLength(2)]],
      content: ['', [Validators.required, Validators.minLength(5)]],
    });

    // Fetch comments for this blog
    this.blogfireService.getCommentsByBlogId(this.id);

    // Subscribe to the comment stream
    this.comments$ = this.blogfireService.comments$;
  }

  addComment(): void {
    if (this.commentForm.valid) {
      const { author, content } = this.commentForm.value;
      this.blogfireService.addComment(this.id, author, content).subscribe(
        () => {
          console.log('Comment added successfully');
          this.commentForm.reset();
        },
        (error) => {
          console.error('Error adding comment:', error);
        }
      );
    } else {
      console.log('Form is invalid');
    }
  }

  likeBlog(): void {
    if (this.blog) {
      this.blogfireService
        .increaseLikes(this.blog.id, this.blog.likes || 0)
        .subscribe(() => {
          this.isLiked = true;
        });
    }
  }

  dislikeBlog(): void {
    if (this.blog && this.blog.likes && this.blog.likes > 0) {
      this.blogfireService
        .decreaseLikes(this.blog.id, this.blog.likes)
        .subscribe(() => {
          this.isLiked = false;
        });
    }
  }

  goBack(): void {
    this.location.back();
  }

  deleteBlog(id: string): void {
    this.modalService.openModal('deletePost', id);
  }
}
