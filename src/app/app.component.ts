import { Component } from '@angular/core';
import { FirestoreService } from './services/firestore.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'firebase-blog';
  constructor(private firestoreService: FirestoreService) {}
}
