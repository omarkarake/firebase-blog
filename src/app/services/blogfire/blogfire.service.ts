import { Injectable } from '@angular/core';
import { addDoc, collectionData, Firestore } from '@angular/fire/firestore';
import { collection } from 'firebase/firestore';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { Blog } from '../../models/blog.model';
import { Comment } from '../../models/comment.model';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class BlogfireService {
  private commentsSubject = new BehaviorSubject<Comment[]>([]);
  comments$ = this.commentsSubject.asObservable(); // Expose the observable

  constructor(private firestore: Firestore) {}

  blogsCollection = collection(this.firestore, 'blogs');
  commentsCollection = collection(this.firestore, 'comments');

  // Fetch all blogs (unchanged)
  getBlogsCollection(): Observable<Blog[]> {
    return collectionData(this.blogsCollection, { idField: 'id' });
  }

  // Add a new blog (unchanged)
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

  // Get blog by ID (unchanged)
  getBlogById(id: string): Observable<Blog> {
    return new Observable<Blog>((observer) => {
      this.getBlogsCollection().subscribe((blogs) => {
        const blog = blogs.find((blog) => blog.id === id);
        observer.next(blog);
        observer.complete();
      });
    });
  }

  // Fetch comments for a specific blog
  getCommentsByBlogId(blogId: string): void {
    this.getCommentsCollection().subscribe((comments) => {
      const blogComments = comments.filter(
        (comment: Comment) => comment.blog_id === blogId
      );
      this.commentsSubject.next(blogComments); // Trigger update
    });
  }

  // Add a comment and trigger re-fetch of comments
  addComment(blogId: string, author: string, content: string): Observable<void> {
    const commentToCreate = { blog_id: blogId, author, content, date: new Date() };
    const promise = addDoc(this.commentsCollection, commentToCreate).then(() => {
      // Trigger comment fetch after adding a new comment
      this.getCommentsByBlogId(blogId);
    });

    return from(promise);
  }

  // Get all comments (unchanged)
  private getCommentsCollection(): Observable<Comment[]> {
    return collectionData(this.commentsCollection, { idField: 'id' }) as Observable<Comment[]>;
  }
}
