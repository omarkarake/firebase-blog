import { Component, OnInit, Renderer2 } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { ModalService } from '../../../../services/modal/modal.service';
import { User } from '../../../../models/user.model';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  isDropdownOpen = false;
  activeRoute: string = '/main'; // Set default to '/main'
  currentUser!: User;

  constructor(
    private renderer: Renderer2,
    private router: Router,
    private modalService: ModalService,
    private authService: AuthService
  ) {
    // Listen for clicks outside the dropdown to close it
    this.renderer.listen('window', 'click', (event: Event) => {
      const target = event.target as HTMLElement | null;
      if (this.isDropdownOpen && target && !target.closest('.avatar-dropdown')) {
        this.isDropdownOpen = false;
      }
    });
  }

  ngOnInit(): void {
    // Listen to route changes and set the activeRoute
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map((event: any) => event.urlAfterRedirects) // Get the current URL
      )
      .subscribe((url) => {
        this.activeRoute = url ? url : '/main'; // If no route, set to '/main'
      });

    this.authService.getCurrentUser().subscribe((user) => {
      if (user) {
        this.currentUser = this.mapFirebaseUserToCustomUser(user);
      } else {
        console.log('No user is logged in');
      }
    });
  }

  // Function to map Firebase User to your custom User model
  mapFirebaseUserToCustomUser(firebaseUser: any): User {
    return {
      fullName: firebaseUser.displayName || '', // Use displayName for fullName
      email: firebaseUser.email,
      avatarUrl: firebaseUser.photoURL || '', // Optional avatarUrl
    };
  }

  // Helper method to check if the current route starts with the provided path
  isActive(route: string): boolean {
    return this.activeRoute.startsWith(route);
  }

  toggleDropdown(event: MouseEvent): void {
    event.stopPropagation(); // Prevent triggering the window click event
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  logout(): void {
    this.authService.logout();
  }

  addPost(): void {
    this.modalService.openModal('addPost');
  }
}
