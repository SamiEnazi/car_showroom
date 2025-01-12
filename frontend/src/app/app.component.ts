import { Component, OnInit } from '@angular/core';
import { NgIf } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  imports: [RouterOutlet, NgIf, RouterModule],
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'Car Showroom Management';
  isMenuOpen = false;
  isDarkMode = false;
  isLoggedIn = false;

  currentYear: number;

  constructor(private authService: AuthService) {
    this.currentYear = new Date().getFullYear();
  }

  ngOnInit(): void {
    // Subscribe to the isLoggedIn$ observable to update the login status
    this.authService.isLoggedIn$.subscribe((isLoggedIn) => {
      this.isLoggedIn = isLoggedIn;
    });

    // Initialize the login status based on the current state
    this.isLoggedIn = this.authService.isLoggedIn();
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    if (this.isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  logout() {
    this.authService.logout();
  }
}