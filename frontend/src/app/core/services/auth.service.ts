import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { BehaviorSubject, Observable, tap } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private userSubject = new BehaviorSubject<any>(null);
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  public user$ = this.userSubject.asObservable();
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor(private http: HttpClient) {
    this.initializeUser();
  }

  private initializeUser(): void {
    const token = localStorage.getItem('authToken'); // Retrieve token from localStorage
    if (token) {
      this.setUser({ token }); // Set user data in memory (you might need to fetch full user data from the server)
      this.isLoggedInSubject.next(true);
    } else {
      this.isLoggedInSubject.next(false);
    }
  }

  register(user: { username: string; email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/auth/register`, user);
  }

  login(credentials: { username: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/auth/login`, credentials).pipe(
      tap((response: any) => {
        if (response.token) {
          localStorage.setItem('authToken', response.token); // Store token in localStorage
          this.setUser(response);
          this.isLoggedInSubject.next(true);
        }
      })
    );
  }

  private setUser(user: any): void {
    this.userSubject.next(user);
  }

  getUser(): any {
    return this.userSubject.value;
  }

  getToken(): string | null {
    return localStorage.getItem('authToken'); // Retrieve token from localStorage
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  isAdmin(): boolean {
    const user = this.userSubject.value;
    return user?.role === 'ADMIN';
  }

  logout(): void {
    localStorage.removeItem('authToken'); // Remove token from localStorage
    this.clearUser();
    this.isLoggedInSubject.next(false);
  }

  private clearUser(): void {
    this.userSubject.next(null);
  }
}