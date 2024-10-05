import { Component } from '@angular/core';
import { ModalService } from '../../services/modal/modal.service';
import { BlogfireService } from '../../services/blogfire/blogfire.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Blog } from '../../models/blog.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  currentModal: string | null = null;
  blogForm!: FormGroup;
  idToUpdate: string | null = null;
  isEditMode: boolean = false;

  constructor(
    private modalService: ModalService,
    private blogfireService: BlogfireService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private router: Router
  ) {
    this.modalService.idTobeEdited.subscribe((id) => {
      this.idToUpdate = id;
      if (id) {
        this.loadBlogData(id);
      }
    });
  }

  ngOnInit(): void {
    this.initializeForm();

    // Subscribe to the modal state to track which modal is open
    this.modalService.modalState$.subscribe((modalName) => {
      this.currentModal = modalName;
      this.isEditMode = modalName === 'updatePost';

      // Reset form when modal closes
      if (!modalName) {
        this.resetForm();
      }
    });

    this.blogfireService.getBlogsCollection().subscribe((blogs) => {
      console.log(blogs);
    });
  }

  private initializeForm(): void {
    this.blogForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      image: ['', [Validators.required]],
      author: ['', [Validators.required, Validators.minLength(2)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      date: [new Date(), Validators.required],
    });
  }

  private loadBlogData(id: string): void {
    this.blogfireService.getBlogById(id).subscribe(
      (blog: Blog | null) => { // Explicitly typing the blog
        if (blog) {
          this.blogForm.patchValue({
            title: blog.title,
            image: blog.image,
            author: blog.author,
            description: blog.description,
            // We do not update the date field as it should remain the original
          });
        } else {
          this.toastr.error('No blog found');
        }
      },
      (error: any) => { // Explicitly typing the error
        this.toastr.error('Error loading blog data');
        console.error('Error loading blog:', error);
      }
    );
  }
  

  onSubmit(): void {
    if (this.blogForm.valid) {
      const formData = this.blogForm.value;
      console.log('Form data:', formData);

      if (this.isEditMode && this.idToUpdate) {
        // Update existing blog
        const { title, image, author, description } = this.blogForm.value;

        this.blogfireService
          .updateBlog(this.idToUpdate, { title, image, author, description })
          .subscribe(
            () => {
              this.toastr.success('Blog updated successfully');
              this.closeModal();
              // Optionally refresh the page or update the blog list
            },
            (error) => {
              this.toastr.error('Error updating blog');
              console.error('Update error:', error);
            }
          );
      } else {
        // Create new blog
        this.createBlog();
      }
    } else {
      this.toastr.error('Please fill out the form correctly');
    }
  }

  createBlog(): void {
    if (this.blogForm.valid) {
      const { title, image, author, description, date } = this.blogForm.value;
      this.blogfireService
        .addBlog(author, date, description, image, title)
        .subscribe(
          (response) => {
            this.toastr.success('Blog added successfully');
            this.resetForm();
            this.modalService.closeModal();
          },
          (error) => {
            this.toastr.error('Error adding blog');
            console.error('Create error:', error);
          }
        );
    }
  }

  private resetForm(): void {
    this.blogForm.reset();
    this.blogForm.patchValue({
      date: new Date(),
    });
    this.idToUpdate = null;
    this.isEditMode = false;
  }

  closeModal() {
    this.resetForm();
    this.modalService.closeModal();
  }

  deleteBlog() {
    this.modalService.id$.subscribe((id) => {
      if (id) {
        this.blogfireService.deleteBlog(id).subscribe(() => {
          this.toastr.success('Blog deleted successfully');
          this.router.navigate(['/main/main']);
          this.modalService.closeModal();
        });
      } else {
        this.toastr.error('Invalid blog ID');
      }
    });
  }

  toggleModal() {
    this.modalService.closeModal();
  }

  acceptTerms() {
    this.modalService.closeModal();
  }
}
