import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BlogfireService } from '../../../services/blogfire/blogfire.service';
import { ActivatedRoute } from '@angular/router';
import { Blog } from '../../../models/blog.model';
import { Comment } from '../../../models/comment.model';
import { Observable } from 'rxjs';
import { Location } from '@angular/common'; 

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css'],
})
export class DetailComponent implements OnInit {
  blog!: Blog;
  comments$!: Observable<Comment[]>;
  commentForm!: FormGroup;
  id: string = '';
  isLiked: boolean = false;

  constructor(
    private fb: FormBuilder,
    private blogfireService: BlogfireService,
    private route: ActivatedRoute,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];

    // Fetch the blog by its ID
    this.blogfireService.getBlogById(this.id).subscribe((blog) => {
      this.blog = blog;
    });

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

  // Add a method to increase the like count
  likeBlog(): void {
    if (this.blog) {
      this.blogfireService.increaseLikes(this.blog.id, this.blog.likes || 0).subscribe(() => {
        this.blog.likes = (this.blog.likes || 0) + 1;
        this.isLiked = true;
      });
    }
  }

  // Add a method to decrease the like count
  dislikeBlog(): void {
    if (this.blog && this.blog.likes && this.blog.likes > 0) {
      this.blogfireService.decreaseLikes(this.blog.id, this.blog.likes).subscribe(() => {
        this.blog.likes = (this.blog.likes || 0) - 1;
        this.isLiked = false;
      });
    }
  }

  goBack(): void {
    this.location.back();
  }
}
