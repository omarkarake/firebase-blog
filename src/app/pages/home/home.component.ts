import { Component } from '@angular/core';
import { ModalService } from '../../services/modal/modal.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  currentModal: string | null = null;

  constructor(private modalService: ModalService) {}

  ngOnInit(): void {
    // Subscribe to the modal state to track which modal is open
    this.modalService.modalState$.subscribe((modalName) => {
      this.currentModal = modalName;
    });
  }

  // Method to close the modal from the main component
  closeModal() {
    this.modalService.closeModal();
  }

  acceptTerms() {}

  toggleModal() {}
}
