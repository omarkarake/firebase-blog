import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {
  blog: any;
  commentForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    // Mock blog data
    this.blog = {
      image: 'assets/hacker.jpg',
      title: 'Blog Title',
      author: 'Author Name',
      date: new Date(),
      content: 'This is the blog content.',
      comments: [
        {
          author: 'Commenter 1',
          date: new Date(),
          content: 'This is a comment.'
        },
        {
          author: 'Commenter 2',
          date: new Date(),
          content: 'This is another comment.'
        }
      ]
    };

    // Initialize the reactive form
    this.commentForm = this.fb.group({
      author: ['', [Validators.required, Validators.minLength(2)]],
      content: ['', [Validators.required, Validators.minLength(5)]]
    });
  }

  addComment(): void {
    if (this.commentForm.valid) {
      const newComment = {
        ...this.commentForm.value,
        date: new Date()
      };
      this.blog.comments.push(newComment);
      this.commentForm.reset();
    }
  }
}
