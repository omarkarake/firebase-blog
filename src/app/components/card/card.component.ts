import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

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

  constructor(private router: Router) {}

  goToDetail(id: string): void {
    this.router.navigate(['/main/detail/', id]);
    console.log('Navigating to detail page with ID:', id);
  }
}
