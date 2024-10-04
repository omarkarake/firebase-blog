import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../components/button/button.component';
import { InputLabelComponent } from '../../components/input-label/input-label.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CardComponent } from '../../components/card/card.component';
import { TimestampPipe } from '../../pipe/timestamp.pipe';

@NgModule({
  declarations: [ButtonComponent, InputLabelComponent, CardComponent, TimestampPipe],
  imports: [CommonModule, ReactiveFormsModule],
  exports: [ButtonComponent, InputLabelComponent, ReactiveFormsModule, CardComponent, TimestampPipe], // Exporting ButtonComponent to be used in other modules
})
export class SharedModule {}
