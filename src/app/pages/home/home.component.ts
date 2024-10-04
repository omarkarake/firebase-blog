import { Component } from '@angular/core';
import { ModalService } from '../../services/modal/modal.service';
import { BlogfireService } from '../../services/blogfire/blogfire.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  currentModal: string | null = null;
  blogForm!: FormGroup;

  constructor(
    private modalService: ModalService,
    private blogfireService: BlogfireService,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.blogForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      image: ['', [Validators.required]],
      author: ['', [Validators.required, Validators.minLength(2)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      date: [new Date(), Validators.required],
    });

    // Subscribe to the modal state to track which modal is open
    this.modalService.modalState$.subscribe((modalName) => {
      this.currentModal = modalName;
    });

    this.blogfireService.getBlogsCollection().subscribe((blogs) => {
      console.log(blogs);
    });

    this.blogfireService.getCommentsCollection().subscribe((comments) => {
      console.log(comments);
    });
  }

  createBlog(): void {
    if (this.blogForm.valid) {
      console.log('Form is valid', this.blogForm.value);
      const { title, image, author, description, date } = this.blogForm.value;
      this.blogfireService.addBlog(author, date, description, image, title)
      .subscribe((response) => {
        console.log('Blog added', response);
        this.toastr.success('Blog added successfully');
        this.blogForm.reset();
        this.modalService.closeModal();
      });
    } else {
      console.log('Form is invalid');
      this.toastr.error('Please fill out the form correctly');
    }
  }

  // Method to close the modal from the main component
  closeModal() {
    this.modalService.closeModal();
  }

  acceptTerms() {}

  toggleModal() {}
}
