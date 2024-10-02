import { Component, Input } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';

@Component({
  selector: 'app-input-label',
  templateUrl: './input-label.component.html',
  styleUrl: './input-label.component.css'
})
export class InputLabelComponent {
  @Input() placeholder: string = 'Type here...'; // Placeholder for the input
  @Input() control: FormControl = new FormControl(''); // Reactive form control
  @Input() formGroup?: AbstractControl; // Optional input for passing form group
  @Input() type: string = 'text'; // Input type
  @Input() label: string = 'label here...'; // Input type

  isTyping: boolean = false;
  value: string = '';

  // Callbacks for control value accessor
  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  // Handles typing input
  isTypingInput() {
    this.isTyping = true;
  }

  // Handles focus-out event
  isTypingOutput() {
    this.isTyping = false;
    this.onTouched(); // Mark control as touched
  }

  // Input event handling
  onInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const value = inputElement.value;
    this.value = value;
    this.onChange(value);
    this.control.setValue(value); // Sync the form control value
  }

  // Implement writeValue to sync the value from parent component
  writeValue(value: string | null): void {
    this.value = value || '';
    if (this.control) {
      this.control.setValue(this.value, { emitEvent: false });
    }
  }

  // Register change function to propagate input value
  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  // Register touched function
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  // Set disabled state for the input
  setDisabledState?(isDisabled: boolean): void {
    if (isDisabled) {
      this.control.disable();
    } else {
      this.control.enable();
    }
  }

  // Getter to show the appropriate error message
  getErrorMessage(): string {
    if (this.control.hasError('required')) {
      return 'Can\'t be empty';
    } else if (this.control.hasError('email')) {
      return 'Invalid email address';
    } else if (this.control.hasError('minlength')) {
      const minLength = this.control.getError('minlength')?.requiredLength;
      return `Password must be at least ${minLength} characters.`;
    } else if (this.control.hasError('passwordMismatch')) {
      return 'Passwords do not match';
    }
    return '';
  }
}
