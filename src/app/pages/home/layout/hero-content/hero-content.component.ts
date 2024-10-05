import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { BlogfireService } from '../../../../services/blogfire/blogfire.service';
import { Blog } from '../../../../models/blog.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-hero-content',
  templateUrl: './hero-content.component.html',
  styleUrl: './hero-content.component.css',
})
export class HeroContentComponent implements OnInit, OnDestroy {
  blogs$: Observable<Blog[]> | undefined;

  // Use ViewChild to access the card section
  @ViewChild('cardSection') cardSection!: ElementRef;

  constructor(
    private blogfireService: BlogfireService
  ) {}

  // Scroll to the card section
  scrollToCards() {
    this.cardSection.nativeElement.scrollIntoView({ behavior: 'smooth' });
  }

  ngOnInit(): void {
    this.blogs$ = this.blogfireService.getBlogsCollection();
  }

  ngOnDestroy(): void {
    // Clean
  }
}
