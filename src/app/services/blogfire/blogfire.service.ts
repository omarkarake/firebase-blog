// blogfire.service.ts

import { Injectable } from '@angular/core';
import { addDoc, collectionData, Firestore } from '@angular/fire/firestore';
import { collection } from 'firebase/firestore';
import { from, Observable } from 'rxjs';
import { Blog } from '../../models/blog.model';
import { Comment } from '../../models/comment.model';

@Injectable({
  providedIn: 'root',
})
export class BlogfireService {
  constructor(private firestore: Firestore) {}
  blogsCollection = collection(this.firestore, 'blogs');
  commentsCollection = collection(this.firestore, 'comments');

  getBlogsCollection(): Observable<Blog[]> {
    return collectionData(this.blogsCollection, { idField: 'id' });
  }

  getCommentsCollection(): Observable<Comment[]> {
    return collectionData(this.commentsCollection, { idField: 'id' }) as Observable<Comment[]>;
  }

  addBlog(
    author: string,
    date: Date,
    description: string,
    image: string,
    title: string
  ) {
    const blogToCreate = { author, date, description, image, title };
    const promise = addDoc(this.blogsCollection, blogToCreate).then(
      (response) => {
        response.id;
      }
    );

    return from(promise);
  }

  addComment(blogId: string, author: string, content: string) {
    const commentToCreate = { blog_id: blogId, author, content, date: new Date() };
    const promise = addDoc(this.commentsCollection, commentToCreate).then(
      (response) => {
        response.id;
      }
    );

    return from(promise);
  }

  getBlogById(id: string): Observable<Blog> {
    return new Observable<Blog>((observer) => {
      this.getBlogsCollection().subscribe((blogs) => {
        const blog = blogs.find((blog) => blog.id === id);
        observer.next(blog);
        observer.complete();
      });
    });
  }

  getCommentsByBlogId(blogId: string): Observable<Comment[]> {
    return new Observable<Comment[]>((observer) => {
      this.getCommentsCollection().subscribe((comments) => {
        const blogComments = comments.filter(
          (comment: Comment) => comment.blog_id === blogId
        );
        observer.next(blogComments);
        observer.complete();
      });
    });
  }
}