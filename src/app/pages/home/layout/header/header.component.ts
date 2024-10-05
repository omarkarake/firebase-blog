import { Component, OnInit, Renderer2 } from '@angular/core';
import { NavigationEnd, Router, ActivatedRoute } from '@angular/router';
import { filter, map, mergeMap } from 'rxjs/operators';
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
  activeRoute: string = '';
  currentUser!: User;
  currentRouteId: string | null = null;

  constructor(
    private renderer: Renderer2,
    private router: Router,
    private activatedRoute: ActivatedRoute,
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

    // Set initial route
    this.activeRoute = this.router.url;
  }

  ngOnInit(): void {
    // Subscribe to route changes and parameters
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this.activatedRoute),
      map(route => {
        while (route.firstChild) {
          route = route.firstChild;
        }
        return route;
      }),
      mergeMap(route => route.params)
    ).subscribe(params => {
      if (params['id']) {
        // console.log('Route ID:', params['id']);
        this.currentRouteId = params['id'];
        this.modalService.idTobeEdited.next(params['id']);
      } else {
        this.currentRouteId = null;
      }
    });

    // Listen to route changes for active route tracking
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map((event: any) => event.urlAfterRedirects)
      )
      .subscribe((url) => {
        this.activeRoute = url;
      });

    this.authService.getCurrentUser().subscribe((user) => {
      if (user) {
        this.currentUser = this.mapFirebaseUserToCustomUser(user);
      } else {
        console.log('No user is logged in');
      }
    });
  }

  // Helper method to check if the current route starts with the provided path
  isActive(route: string): boolean {
    // If we're checking the main route and the current route is exactly '/main'
    if (route === '/main/main' && this.activeRoute === '/main') {
      return true;
    }
    
    // For detail routes, match only the base path without the ID
    if (route === '/main/detail' && this.currentRouteId) {
      return this.activeRoute.startsWith(route);
    }
    
    return this.activeRoute.startsWith(route);
  }

  mapFirebaseUserToCustomUser(firebaseUser: any): User {
    return {
      fullName: firebaseUser.displayName || '',
      email: firebaseUser.email,
      avatarUrl: firebaseUser.photoURL || '',
    };
  }

  toggleDropdown(event: MouseEvent): void {
    event.stopPropagation();
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  logout(): void {
    this.authService.logout();
  }

  addPost(): void {
    this.modalService.openModal('addPost');
  }

  updatePost(): void {
    this.modalService.openModal('updatePost');
  }

  updateUser(): void {
    this.modalService.openModal('editProfile');
  }
}