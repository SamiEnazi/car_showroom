import { Component, OnInit } from '@angular/core';
import { AsyncPipe, NgIf } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';
import { AuthService } from './core/services/auth.service';
import { map } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  imports: [RouterOutlet, NgIf, RouterModule, AsyncPipe],
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'Car Showroom Management';
  isMenuOpen = false;
  isDarkMode = false;
  isLoggedIn$ = this.authService.isLoggedIn$;
  user$ = this.authService.user$;
  isAdmin$ = this.user$.pipe(
    map(user => user?.role === 'ADMIN')
  );
  currentYear: number;

  constructor(private authService: AuthService) {
    this.currentYear = new Date().getFullYear();
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    document.documentElement.classList.toggle('dark', this.isDarkMode);
  }

  logout() {
    this.authService.logout();
  }
}