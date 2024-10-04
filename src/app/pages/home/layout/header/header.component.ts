import { Component, HostListener, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ModalService } from '../../../../services/modal/modal.service';
import { filter } from 'rxjs/operators';
import { User } from '../../../../models/user.model';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
  isDropdownOpen = false;
  activeRoute: string = '';
  currentUser!: User;

  constructor(private renderer: Renderer2, private router: Router, private modalService: ModalService, private authService: AuthService) {
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

  ngOnInit(): void {
    // Listen to route changes
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.activeRoute = event.urlAfterRedirects;
      });

      this.authService.getCurrentUser().subscribe((user) => {
        if (user) {
          this.currentUser = this.mapFirebaseUserToCustomUser(user);
          console.log('Mapped user:', this.currentUser);
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

  // Method to check if the link is active
  isActive(route: string): boolean {
    return this.activeRoute.startsWith(route) && !this.activeRoute.includes('/main/detail');
  }

  toggleDropdown(event: MouseEvent): void {
    event.stopPropagation(); // Prevent triggering the window click event
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  logout() {
    this.authService.logout();
  }

  addPost(){
    this.modalService.openModal('addPost');
  }
}
