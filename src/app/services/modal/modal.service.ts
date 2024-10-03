import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  // BehaviorSubject to manage the modal state
  private modalState = new BehaviorSubject<string | null>(null);

  // Observable to track modal changes
  modalState$ = this.modalState.asObservable();

  // Method to open a modal by its name
  openModal(modalName: string) {
    this.modalState.next(modalName);
  }

  // Method to close the modal
  closeModal() {
    this.modalState.next(null);
  }
}
