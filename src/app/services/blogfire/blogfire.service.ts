import { inject, Injectable } from '@angular/core';
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
import { Analytics, logEvent } from '@angular/fire/analytics';

@Injectable({
  providedIn: 'root',
})
export class BlogfireService {
  private commentsSubject = new BehaviorSubject<Comment[]>([]);
  comments$ = this.commentsSubject.asObservable();

  private blogSubject = new BehaviorSubject<Blog | null>(null);
  blog$ = this.blogSubject.asObservable();
  
  private analytics: Analytics = inject(Analytics);
  constructor(
    private firestore: Firestore,
  ) {}

  blogsCollection = collection(this.firestore, 'blogs');
  commentsCollection = collection(this.firestore, 'comments');

  getBlogsCollection(): Observable<Blog[]> {
    logEvent(this.analytics, 'view_blog_list');
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
      logEvent(this.analytics, 'blog_created', {
        author: author,
        title: title
      });
    });
    return from(promise);
  }

  getBlogById(id: string): Observable<Blog | null> {
    logEvent(this.analytics, 'view_blog_detail', {
      blog_id: id
    });
    return this.getBlogsCollection().pipe(
      map((blogs: Blog[]) => {
        const blog = blogs.find((blog) => blog.id === id);
        this.blogSubject.next(blog ?? null);
        return blog ?? null;
      })
    );
  }

  getCommentsByBlogId(blogId: string): void {
    logEvent(this.analytics, 'view_blog_comments', {
      blog_id: blogId
    });
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
        logEvent(this.analytics, 'comment_added', { 
          blog_id: blogId,
          author: author
        });
      }
    );

    return from(promise);
  }

  deleteBlog(blogId: string): Observable<void> {
    const docRef = doc(this.firestore, `blogs/${blogId}`);
    logEvent(this.analytics, 'blog_deleted', {
      blog_id: blogId
    });
    const promise = deleteDoc(docRef);
    return from(promise);
  }

  increaseLikes(blogId: string, currentLikes: number): Observable<void> {
    const blogDocRef = doc(this.firestore, `blogs/${blogId}`);
    const promise = updateDoc(blogDocRef, { likes: currentLikes + 1 }).then(
      () => {
        this.getBlogById(blogId);
        logEvent(this.analytics, 'blog_liked', { 
          blog_id: blogId,
          likes_count: currentLikes + 1
        });
      }
    );
    return from(promise);
  }

  decreaseLikes(blogId: string, currentLikes: number): Observable<void> {
    const blogDocRef = doc(this.firestore, `blogs/${blogId}`);
    const promise = updateDoc(blogDocRef, {
      likes: currentLikes > 0 ? currentLikes - 1 : 0,
    }).then(() => {
      this.getBlogById(blogId);
      logEvent(this.analytics, 'blog_unliked', { 
        blog_id: blogId,
        likes_count: currentLikes > 0 ? currentLikes - 1 : 0
      });
    });
    return from(promise);
  }

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
      this.getBlogById(blog_id);
      logEvent(this.analytics, 'blog_updated', {
        blog_id: blog_id,
        author: dataToUpdate.author,
        title: dataToUpdate.title
      });
    });
    return from(promise);
  }

  private getCommentsCollection(): Observable<Comment[]> {
    return collectionData(this.commentsCollection, {
      idField: 'id',
    }) as Observable<Comment[]>;
  }
}