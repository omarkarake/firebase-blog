import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BlogfireService } from '../../../services/blogfire/blogfire.service';
import { ActivatedRoute } from '@angular/router';
import { Blog } from '../../../models/blog.model';
import { Timestamp } from 'firebase/firestore';
import { Comment } from '../../../models/comment.model';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css'],
})
export class DetailComponent implements OnInit {
  blog!: Blog;
  blogComment!: Comment[];
  commentForm!: FormGroup;
  id: string = '';

  constructor(
    private fb: FormBuilder,
    private blogfireService: BlogfireService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {

    this.id = this.route.snapshot.params['id'];
    this.blogfireService.getBlogById(this.id).subscribe((blog) => {
      this.blog = blog;
    });

    // Initialize the reactive form
    this.commentForm = this.fb.group({
      author: ['', [Validators.required, Validators.minLength(2)]],
      content: ['', [Validators.required, Validators.minLength(5)]],
    });

    this.blogfireService.getCommentsByBlogId(this.id).subscribe((comments) => {
      console.log('comments for single blog:', comments);
      this.blogComment = comments;
    });
  }

  convertTimestamp(timestamp: Timestamp): Date {
    return new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
  }

  addComment(): void {
    if (this.commentForm.valid) {
      const newComment = {
        ...this.commentForm.value,
        date: new Date(),
        blog_id: this.id,
      };

      const { author, blog_id, content, date } = newComment;
      this.blogfireService.addComment(blog_id, author, content).subscribe(
        (response) => {
          console.log('Comment added', response);
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
}
