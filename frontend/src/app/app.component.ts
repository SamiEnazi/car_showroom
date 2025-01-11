import { Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  imports: [RouterOutlet, NgIf, RouterModule],
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Car Showroom Management';
  isMenuOpen = false;
  isDarkMode = false;
  currentYear: number = 999;
  constructor(private authService: AuthService) {
    this.currentYear = new Date().getFullYear();
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

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.authService.fetchUserData().subscribe();
    }
  }
}