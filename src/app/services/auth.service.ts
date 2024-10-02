import { inject, Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
} from '@angular/fire/auth';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError, from, Observable, of, switchMap, take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private toastr: ToastrService,
    private firebaseAuth: Auth,
    private router: Router
  ) {}

  register(
    email: string,
    fullName: string,
    password: string
  ): Observable<void> {
    const promise = createUserWithEmailAndPassword(
      this.firebaseAuth,
      email,
      password
    ).then((response) =>
      updateProfile(response.user, { displayName: fullName })
    );
    return from(promise);
  }

  signin(email: string, password: string): Observable<void> {
    const promise = signInWithEmailAndPassword(
      this.firebaseAuth,
      email,
      password
    ).then(() => {});
    return from(promise);
  }

  private loggedIn = false;

  // Login method
  login(email: string, password: string): Observable<any> {
    return this.signin(email, password).pipe(
      take(1), // Ensures the observable completes after one emission
      // Handle success and error cases within the pipe
      switchMap(() => {
        this.loggedIn = true;
        return of({ success: true });
      }),
      catchError(() => {
        return of({ success: false });
      })
    );
  }

  createAcountWithGoogle(): Observable<void> {
    const provider = new GoogleAuthProvider();
    const promise = signInWithPopup(this.firebaseAuth, provider)
      .then(() => {
        this.loggedIn= true;
      })
      .catch((error) => {
        if (error.code === 'auth/popup-closed-by-user') {
          return Promise.reject(
            new Error('Google login canceled by the user.')
          );
        }
        return Promise.reject(error);
      });

    return from(promise); // return the promise to an observable
  }

  // Signup method
  signup(email: string, fullName: string, password: string): Observable<any> {

    return this.register(email, fullName, password).pipe(
      take(1), // Ensures the observable completes after one emission
      // Handle success and error cases within the pipe
      switchMap(() => {
        this.router.navigateByUrl('/login');
        return of({ success: true });
      }),
      catchError(() => {
        return of({ success: false, message: 'User already exists' });
      })
    );
  }

  isAuthenticated(): boolean {
    return this.loggedIn;
  }

  logout(): Observable<void> {
    const promise = signOut(this.firebaseAuth);
    this.loggedIn = false;
    this.router.navigate(['/auth/login']);
    this.toastr.success('Logged out successfully!', 'Success');
    return from(promise);
  }
}
