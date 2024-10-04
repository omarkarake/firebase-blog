import { Injectable } from '@angular/core';
import { addDoc, collectionData, Firestore, updateDoc, doc } from '@angular/fire/firestore';
import { collection } from 'firebase/firestore';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { Blog } from '../../models/blog.model';
import { Comment } from '../../models/comment.model';

@Injectable({
  providedIn: 'root',
})
export class BlogfireService {
  private commentsSubject = new BehaviorSubject<Comment[]>([]);
  comments$ = this.commentsSubject.asObservable();

  constructor(private firestore: Firestore) {}

  blogsCollection = collection(this.firestore, 'blogs');
  commentsCollection = collection(this.firestore, 'comments');

  getBlogsCollection(): Observable<Blog[]> {
    return collectionData(this.blogsCollection, { idField: 'id' });
  }

  addBlog(
    author: string,
    date: Date,
    description: string,
    image: string,
    title: string
  ) {
    const blogToCreate = { author, date, description, image, title, likes: 0 }; // Initialize likes to 0
    const promise = addDoc(this.blogsCollection, blogToCreate).then(
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

  getCommentsByBlogId(blogId: string): void {
    this.getCommentsCollection().subscribe((comments) => {
      const blogComments = comments.filter(
        (comment: Comment) => comment.blog_id === blogId
      );
      this.commentsSubject.next(blogComments);
    });
  }

  addComment(blogId: string, author: string, content: string): Observable<void> {
    const commentToCreate = { blog_id: blogId, author, content, date: new Date() };
    const promise = addDoc(this.commentsCollection, commentToCreate).then(() => {
      this.getCommentsByBlogId(blogId);
    });

    return from(promise);
  }

  // New method to increase the likes of a blog
  increaseLikes(blogId: string, currentLikes: number): Observable<void> {
    const blogDocRef = doc(this.firestore, `blogs/${blogId}`);
    const promise = updateDoc(blogDocRef, { likes: currentLikes + 1 });

    return from(promise);
  }

  // New method to decrease the likes of a blog
  decreaseLikes(blogId: string, currentLikes: number): Observable<void> {
    const blogDocRef = doc(this.firestore, `blogs/${blogId}`);
    const promise = updateDoc(blogDocRef, { likes: currentLikes > 0 ? currentLikes - 1 : 0 });

    return from(promise);
  }

  private getCommentsCollection(): Observable<Comment[]> {
    return collectionData(this.commentsCollection, { idField: 'id' }) as Observable<Comment[]>;
  }
}
