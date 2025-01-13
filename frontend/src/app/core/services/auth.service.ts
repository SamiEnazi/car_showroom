import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { AuthStateService } from './auth-state.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private authState: AuthStateService
  ) {
    this.initializeUser();
  }

  private initializeUser(): void {
    const token = localStorage.getItem('token');
    if (token) {
      this.authState.setUser({ token });
      this.fetchUserProfile().subscribe({
        next: (userData) => {
          this.authState.setUser({ ...userData, token });
        },
        error: (error) => {
          console.error('Profile fetch error:', error);
        }
      });
    }
  }

  private fetchUserProfile(): Observable<any> {
    return this.http.get(`${this.apiUrl}/auth/profile`);
  }

  login(credentials: { username: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, credentials).pipe(
      tap((response: any) => {
        if (response.token) {
          localStorage.setItem('token', response.token);
          this.authState.setUser(response);
        }
      })
    );
  }

  register(user: { username: string; email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, user);
  }

  logout(): void {
    localStorage.removeItem('token');
    this.authState.clearUser();
  }

  // Proxy methods for convenience
  get user$() { return this.authState.user$; }
  get isLoggedIn$() { return this.authState.isLoggedIn$; }
  isAdmin() { return this.authState.isAdmin(); }
}