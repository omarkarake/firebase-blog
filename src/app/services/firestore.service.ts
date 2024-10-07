import { Injectable } from '@angular/core';
import { Firestore, enableIndexedDbPersistence } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  constructor(private firestore: Firestore) {
    // Enable offline data persistence
    enableIndexedDbPersistence(this.firestore)
      .catch((err) => {
        if (err.code == 'failed-precondition') {
          console.error('Multiple tabs open. Offline data persistence can only be enabled in one tab at a time.');
        } else if (err.code == 'unimplemented') {
          console.error('The browser does not support offline data persistence.');
        }
      });
  }
}
