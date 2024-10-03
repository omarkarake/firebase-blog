import { Component } from '@angular/core';
import { ModalService } from '../../../services/modal/modal.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent {
  isModalOpen = false;

  constructor(private modalService: ModalService) {}
  // Method to open the edit profile modal
  toggleModal() {
    this.modalService.openModal('editProfile');
  }
}
