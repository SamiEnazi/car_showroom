import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private userSubject = new BehaviorSubject<any>(null); // Holds the user object in memory
  public user$ = this.userSubject.asObservable(); // Observable to subscribe to user changes

  constructor(private http: HttpClient) {
    // On service initialization, check for a token and fetch user data
    this.initializeUser();
  }

  // Initialize user state on app load
  private initializeUser(): void {
    const token = this.getToken();
    if (token) {
      this.fetchUserData().subscribe();
    }
  }

  // Register a new user
  register(user: { username: string, email: string, password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/auth/register`, user);
  }

  // Login with username and password
  login(credentials: { username: string, password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/auth/login`, credentials).pipe(
      tap((response: any) => {
        if (response.token) {
          localStorage.setItem('token', response.token); // Store token in localStorage
          this.fetchUserData().subscribe(); // Fetch user data after login
        }
      })
    );
  }

  // Fetch user data from the server
  fetchUserData(): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/auth/me`).pipe(
      tap((user: any) => {
        this.setUser(user); // Set user data in memory
      })
    );
  }

  // Set the user object in memory
  private setUser(user: any): void {
    this.userSubject.next(user);
  }

  // Get the current user object
  getUser(): any {
    return this.userSubject.value;
  }

  // Get the token from localStorage
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Check if the user is logged in
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  // Logout the user
  logout(): void {
    localStorage.removeItem('token'); // Remove the token from localStorage
    this.userSubject.next(null); // Clear the user object from memory
  }

  // Test a public endpoint
  testPublicEndpoint(): void {
    this.http.get(`${this.apiUrl}/public/test`).subscribe(
      response => console.log('Public endpoint response:', response)
    );
  }
}