import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrl: './card.component.css',
})
export class CardComponent {
  @Input() image: string = 'Image preview';
  @Input() title: string = 'Title preview';
  @Input() description: string = 'Description preview';
  @Input() id: string = 'ID preview';
}
