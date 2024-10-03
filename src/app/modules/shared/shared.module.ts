import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../components/button/button.component';
import { InputLabelComponent } from '../../components/input-label/input-label.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CardComponent } from '../../components/card/card.component';

@NgModule({
  declarations: [ButtonComponent, InputLabelComponent, CardComponent],
  imports: [CommonModule, ReactiveFormsModule],
  exports: [ButtonComponent, InputLabelComponent, ReactiveFormsModule, CardComponent], // Exporting ButtonComponent to be used in other modules
})
export class SharedModule {}
