import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../components/button/button.component';
import { InputLabelComponent } from '../../components/input-label/input-label.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [ButtonComponent, InputLabelComponent],
  imports: [CommonModule, ReactiveFormsModule],
  exports: [ButtonComponent, InputLabelComponent, ReactiveFormsModule], // Exporting ButtonComponent to be used in other modules
})
export class SharedModule {}
