import { inject, Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  User,
} from '@angular/fire/auth';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, catchError, from, Observable, of, switchMap, take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userSubject = new BehaviorSubject<User | null>(null); // BehaviorSubject to store user
  public user$ = this.userSubject.asObservable(); // Expose user as observable

  private loggedIn = false; // Track if user is logged in

  constructor(
    private toastr: ToastrService,
    private firebaseAuth: Auth,
    private router: Router
  ) {}

  // Register and update user profile with full name
  register(email: string, fullName: string, password: string): Observable<void> {
    const promise = createUserWithEmailAndPassword(this.firebaseAuth, email, password)
      .then((response) => {
        updateProfile(response.user, { displayName: fullName });
        this.userSubject.next(response.user); // Update user in BehaviorSubject
      });
    return from(promise);
  }

  // Sign in method
  signin(email: string, password: string): Observable<void> {
    const promise = signInWithEmailAndPassword(this.firebaseAuth, email, password)
      .then((response) => {
        this.userSubject.next(response.user); // Update user in BehaviorSubject
      });
    return from(promise);
  }

  // Login method
  login(email: string, password: string): Observable<any> {
    return this.signin(email, password).pipe(
      take(1), // Ensures the observable completes after one emission
      switchMap(() => {
        this.loggedIn = true;
        return of({ success: true });
      }),
      catchError((error) => {
        this.toastr.error('Login failed!', 'Error');
        return of({ success: false, error });
      })
    );
  }

  // Google sign in method
  createAccountWithGoogle(): Observable<void> {
    const provider = new GoogleAuthProvider();
    const promise = signInWithPopup(this.firebaseAuth, provider)
      .then((response) => {
        this.userSubject.next(response.user); // Update user in BehaviorSubject
        this.loggedIn = true;
      })
      .catch((error) => {
        if (error.code === 'auth/popup-closed-by-user') {
          this.toastr.error('Google login canceled by the user.');
          return Promise.reject(new Error('Google login canceled by the user.'));
        }
        return Promise.reject(error);
      });
    return from(promise);
  }

  // Signup method
  signup(email: string, fullName: string, password: string): Observable<any> {
    return this.register(email, fullName, password).pipe(
      take(1),
      switchMap(() => {
        this.router.navigateByUrl('/login');
        return of({ success: true });
      }),
      catchError((error) => {
        this.toastr.error('Signup failed. User might already exist.', 'Error');
        return of({ success: false, message: 'User already exists', error });
      })
    );
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return this.loggedIn;
  }

  // Logout method
  logout(): Observable<void> {
    const promise = signOut(this.firebaseAuth).then(() => {
      this.userSubject.next(null); // Clear user from BehaviorSubject
      this.loggedIn = false;
      this.router.navigate(['/auth/login']);
      this.toastr.success('Logged out successfully!', 'Success');
    });
    return from(promise);
  }

  // Method to get the current user as an observable
  getCurrentUser(): Observable<User | null> {
    return this.user$; // Return the BehaviorSubject as observable
  }
}
