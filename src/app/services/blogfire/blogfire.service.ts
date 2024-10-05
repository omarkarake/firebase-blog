import { Injectable } from '@angular/core';
import {
  addDoc,
  collectionData,
  Firestore,
  updateDoc,
  doc,
} from '@angular/fire/firestore';
import { collection, deleteDoc, setDoc } from 'firebase/firestore';
import { BehaviorSubject, from, map, Observable } from 'rxjs';
import { Blog } from '../../models/blog.model';
import { Comment } from '../../models/comment.model';

@Injectable({
  providedIn: 'root',
})
export class BlogfireService {
  private commentsSubject = new BehaviorSubject<Comment[]>([]);
  comments$ = this.commentsSubject.asObservable();

  // BehaviorSubject for blogs
  private blogSubject = new BehaviorSubject<Blog | null>(null);
  blog$ = this.blogSubject.asObservable(); // Expose the blog as an observable

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
  ): Observable<void> {
    const blogToCreate = { author, date, description, image, title, likes: 0 };
    const promise = addDoc(this.blogsCollection, blogToCreate).then(() => {
      // Do any additional work after creating a blog, if necessary
    });
    return from(promise); // Ensure you return the observable here
  }

  // blogfire.service.ts
  getBlogById(id: string): Observable<Blog | null> {
    return this.getBlogsCollection().pipe(
      map((blogs: Blog[]) => {
        const blog = blogs.find((blog) => blog.id === id);
        this.blogSubject.next(blog ?? null); // Emit the fetched blog via BehaviorSubject
        return blog ?? null;
      })
    );
  }

  getCommentsByBlogId(blogId: string): void {
    this.getCommentsCollection().subscribe((comments) => {
      const blogComments = comments.filter(
        (comment: Comment) => comment.blog_id === blogId
      );
      this.commentsSubject.next(blogComments);
    });
  }

  addComment(
    blogId: string,
    author: string,
    content: string
  ): Observable<void> {
    const commentToCreate = {
      blog_id: blogId,
      author,
      content,
      date: new Date(),
    };
    const promise = addDoc(this.commentsCollection, commentToCreate).then(
      () => {
        this.getCommentsByBlogId(blogId);
      }
    );

    return from(promise);
  }

  deleteBlog(blogId: string): Observable<void> {
    const docRef = doc(this.firestore, `blogs/${blogId}`);
    const promise = deleteDoc(docRef);
    return from(promise);
  }

  increaseLikes(blogId: string, currentLikes: number): Observable<void> {
    const blogDocRef = doc(this.firestore, `blogs/${blogId}`);
    const promise = updateDoc(blogDocRef, { likes: currentLikes + 1 }).then(
      () => {
        this.getBlogById(blogId); // Fetch the updated blog and emit the latest value
      }
    );
    return from(promise);
  }

  decreaseLikes(blogId: string, currentLikes: number): Observable<void> {
    const blogDocRef = doc(this.firestore, `blogs/${blogId}`);
    const promise = updateDoc(blogDocRef, {
      likes: currentLikes > 0 ? currentLikes - 1 : 0,
    }).then(() => {
      this.getBlogById(blogId); // Fetch the updated blog and emit the latest value
    });
    return from(promise);
  }

  // blogfire.service.ts
  updateBlog(
    blog_id: string,
    dataToUpdate: {
      author: string;
      image: string;
      description: string;
      title: string;
    }
  ): Observable<void> {
    const docRef = doc(this.firestore, `blogs/${blog_id}`);
    const promise = setDoc(docRef, dataToUpdate, { merge: true }).then(() => {
      this.getBlogById(blog_id); // Emit updated blog data after the update
    });
    return from(promise); // Ensure you return the observable here
  }

  private getCommentsCollection(): Observable<Comment[]> {
    return collectionData(this.commentsCollection, {
      idField: 'id',
    }) as Observable<Comment[]>;
  }
}
