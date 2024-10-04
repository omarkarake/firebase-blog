import { Component, OnInit } from '@angular/core';
import { ModalService } from '../../../services/modal/modal.service';
import { AuthService } from '../../../services/auth.service';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  isModalOpen = false;
  currentUser!: User;

  constructor(
    private modalService: ModalService,
    private authService: AuthService
  ) {}

  // Method to open the edit profile modal
  toggleModal() {
    this.modalService.openModal('editProfile');
  }

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe((user) => {
      if (user) {
        this.currentUser = this.mapFirebaseUserToCustomUser(user);
        console.log('Mapped user:', this.currentUser);
      } else {
        console.log('No user is logged in');
      }
    });
  }

  // Function to map Firebase User to your custom User model
  mapFirebaseUserToCustomUser(firebaseUser: any): User {
    return {
      fullName: firebaseUser.displayName || '', // Use displayName for fullName
      email: firebaseUser.email,
      avatarUrl: firebaseUser.photoURL || '', // Optional avatarUrl
    };
  }
}
