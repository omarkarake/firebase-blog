import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from '../../../models/user.model';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loading: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    // Initialize form with validators
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
    });

    // Subscribe to form changes and log the value
    this.loginForm.valueChanges.subscribe((value) => {
      console.log('Form value:', value);
    });
  }

  // Submit function
  onSubmit(): void {
    this.loading = true;
    this.markFormGroupTouched(this.loginForm);
    if (this.loginForm.valid) {
      const { email, password }: User = this.loginForm.value;
      this.authService.login(email, password).subscribe({
        next: (response) => {
          if (response.success) {
            this.toastr.success('Login successful!');
            this.loading = false;

            this.router.navigate(['/main']);
          } else {
            this.loading = false;
            this.toastr.error('Invalid login!');
          }
        },
        error: (err) => {
          this.toastr.error('Login failed!', err.message);
          this.loading = false;
        },
      });
      console.log('Form value:', this.loginForm.value);
    } else {
      this.loading = false;
      this.logValidationErrors();
    }
  }

  // Method to log validation errors in the console
  logValidationErrors(): void {
    const controls = this.loginForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        console.log(`${name} is invalid`, controls[name].errors);
      }
    }
  }

  // Getter for email control
  get emailControl(): FormControl {
    return this.loginForm.get('email') as FormControl;
  }

  // Getter for password control
  get passwordControl(): FormControl {
    return this.loginForm.get('password') as FormControl;
  }

  // Method to mark all controls as touched
  markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach((key) => {
      const control = formGroup.get(key);
      if (control instanceof FormControl) {
        control.markAsTouched();
      } else if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}
