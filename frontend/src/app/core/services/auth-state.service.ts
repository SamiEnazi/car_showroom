import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthStateService {
  private userSubject = new BehaviorSubject<any>(null);
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);

  public user$ = this.userSubject.asObservable();
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();

  setUser(user: any): void {
    this.userSubject.next(user);
    this.isLoggedInSubject.next(true);
  }

  clearUser(): void {
    this.userSubject.next(null);
    this.isLoggedInSubject.next(false);
  }

  getUser(): any {
    return this.userSubject.value;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAdmin(): boolean {
    return this.userSubject.value?.role === 'ADMIN';
  }
}