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
  }

  // Submit function
  onSubmit(): void {
    this.loading = true;
    this.markFormGroupTouched(this.loginForm);
    if (this.loginForm.valid) {
      const email = this.loginForm.get('email')?.value as string;
    const password = this.loginForm.get('password')?.value as string;
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
    } else {
      this.loading = false;
      this.logValidationErrors();
    }
  }

  loginWithGoogle(): void {
    this.loading = true;
    this.authService.createAccountWithGoogle().subscribe({
      next: () => {
        this.loading = false;
        this.router.navigateByUrl('/main');
      },
      error: (err) => {
        this.loading = false;
        if (err.message === 'Google login canceled by the user.') {
          this.toastr.error('Google login canceled. Please try again.');
        } else {
          this.toastr.error(err.message || 'Google login failed');
        }
      },
    });
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
