import { Component, HostListener, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  isDropdownOpen = false;

  constructor(private renderer: Renderer2, private router: Router) {
    // Listen for clicks outside the dropdown to close it
    this.renderer.listen('window', 'click', (event: Event) => {
      const target = event.target as HTMLElement | null;
      if (
        this.isDropdownOpen &&
        target &&
        !target.closest('.avatar-dropdown')
      ) {
        this.isDropdownOpen = false;
      }
    });
  }

  toggleDropdown(event: MouseEvent): void {
    event.stopPropagation(); // Prevent triggering the window click event
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  logout() {
    this.router.navigate(['/auth/login']);
  }
}
