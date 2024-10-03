import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {
  blog: any;
  newComment: any = {
    author: '',
    content: '',
    date: new Date()
  };

  constructor() {}

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
  }

  addComment(): void {
    this.newComment.date = new Date();
    this.blog.comments.push({ ...this.newComment });
    this.newComment.author = '';
    this.newComment.content = '';
  }
}