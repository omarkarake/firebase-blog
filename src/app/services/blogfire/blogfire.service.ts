import { Injectable } from '@angular/core';
import { addDoc, collectionData, Firestore } from '@angular/fire/firestore';
import { collection } from 'firebase/firestore';
import { from, Observable } from 'rxjs';
import { Blog } from '../../models/blog.model';

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
  //  should be using as Observable<Blog[]>, but not necessary right now

  // ERROR FirebaseError: Invalid collection reference. Collection references must have an odd number of segments, but comments/blogId has 2.
  getCommentsCollection(): Observable<any> {
    return collectionData(this.commentsCollection, { idField: 'id' });
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
}
