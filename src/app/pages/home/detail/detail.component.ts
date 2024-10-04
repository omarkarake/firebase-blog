import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BlogfireService } from '../../../services/blogfire/blogfire.service';
import { ActivatedRoute } from '@angular/router';
import { Blog } from '../../../models/blog.model';
import { Timestamp } from 'firebase/firestore';
import { Comment } from '../../../models/comment.model';
import { Observable } from 'rxjs';
import { Location } from '@angular/common'; // Import Location

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

  constructor(
    private fb: FormBuilder,
    private blogfireService: BlogfireService,
    private route: ActivatedRoute,
    private location: Location // Inject Location service
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
    this.comments$ = this.blogfireService.comments$
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

  // Add a method to go back
  goBack(): void {
    this.location.back();
  }
}
