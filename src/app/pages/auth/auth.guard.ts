import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router, private toastr: ToastrService) {}

  canActivate(): boolean {
    const isAuthenticated = this.authService.isAuthenticated();
    if (!isAuthenticated) {
      this.router.navigate(['/auth/login']); // Redirect to login if not authenticated
      this.toastr.error('Please log in to access this page.', 'Unauthorized', {
        timeOut: 3000, // 3 seconds
        positionClass: 'toast-top-right',
        disableTimeOut: false,
      });
      return false;
    }
    return true;
  }
}
