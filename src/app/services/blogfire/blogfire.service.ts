import { Injectable } from '@angular/core';
import { collectionData, Firestore } from '@angular/fire/firestore';
import { collection } from 'firebase/firestore';
import { Observable } from 'rxjs';
import { Blog } from '../../models/blog.model';

@Injectable({
  providedIn: 'root',
})
export class BlogfireService {
  constructor(private firestore: Firestore) {}
  blogsCollection = collection(this.firestore, 'blogs');
  commentsCollection = collection(this.firestore, 'comments');

  getBlogsCollection(): Observable<Blog[]>{
    return collectionData(this.blogsCollection, {idField: 'id'});
  }
  //  should be using as Observable<Blog[]>, but not necessary right now

  // ERROR FirebaseError: Invalid collection reference. Collection references must have an odd number of segments, but comments/blogId has 2.
  getCommentsCollection(): Observable<any> {
    return collectionData(this.commentsCollection, {idField: 'id'});
  }
}
