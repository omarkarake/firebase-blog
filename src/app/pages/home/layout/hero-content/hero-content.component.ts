import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-hero-content',
  templateUrl: './hero-content.component.html',
  styleUrl: './hero-content.component.css',
})
export class HeroContentComponent {
  // Use ViewChild to access the card section
  @ViewChild('cardSection') cardSection!: ElementRef;

  // Scroll to the card section
  scrollToCards() {
    this.cardSection.nativeElement.scrollIntoView({ behavior: 'smooth' });
  }
}
