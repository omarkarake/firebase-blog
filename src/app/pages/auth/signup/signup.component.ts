import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, ValidatorFn, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  signupForm!: FormGroup;

  constructor() {}

  ngOnInit(): void {
    // Initialize the form group with form controls
    this.signupForm = new FormGroup({
      fullName: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      confirmPassword: new FormControl('', [Validators.required])
    }, { validators: this.passwordMatchValidator });

    this.signupForm.valueChanges.subscribe((value) => {
      console.log('Form value:', value);
    });
  }

  // Custom validator to check if password and confirm password match
  passwordMatchValidator: ValidatorFn = (control: AbstractControl): { [key: string]: any } | null => {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    
    // Only validate if both fields have values
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      // Set the error on the confirmPassword control
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    
    // Clear the error from confirmPassword if passwords match
    if (confirmPassword?.hasError('passwordMismatch')) {
      confirmPassword.setErrors(null);
    }
    
    return null;
  };

  // Submit function
  onSubmit(): void {
    if (this.signupForm.valid) {
      const { fullName, email, password } = this.signupForm.value;
      console.log('Form value:', this.signupForm.value);
    } else {
      this.logValidationErrors();
      console.log('Form is invalid');
    }
  }

  // Method to log validation errors
  logValidationErrors(): void {
    const controls = this.signupForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        console.log(`${name} is invalid`, controls[name].errors);
      }
    }
  }

  // Getter for fullName control
  get fullNameControl(): FormControl {
    return this.signupForm.get('fullName') as FormControl;
  }

  // Getter for email control
  get emailControl(): FormControl {
    return this.signupForm.get('email') as FormControl;
  }

  // Getter for password control
  get passwordControl(): FormControl {
    return this.signupForm.get('password') as FormControl;
  }

  get confirmPasswordControl(): FormControl {
    return this.signupForm.get('confirmPassword') as FormControl;
  }
}
