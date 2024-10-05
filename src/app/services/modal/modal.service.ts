import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  // BehaviorSubject to manage the modal state
  private modalState = new BehaviorSubject<string | null>(null);
  private idToBeDeleted= new BehaviorSubject<string | null>(null);


  // Observable to track modal changes
  modalState$ = this.modalState.asObservable();
  id = this.idToBeDeleted.asObservable();

  // Method to open a modal by its name
  openModal(modalName: string, data?: string) {
    this.modalState.next(modalName);
    if (data) {
      this.idToBeDeleted.next(data);
    }
  }

  // Method to close the modal
  closeModal() {
    this.modalState.next(null);
  }
}
