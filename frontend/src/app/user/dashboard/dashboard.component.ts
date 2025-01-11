import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { CarService } from '../../core/services/car.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  userName: string = '';
  recentCars: any[] = [];
  errorMessage: string = '';
  page: number = 0; // Current page
  size: number = 5; // Number of items per page
  totalElements: number = 0; // Total number of cars

  constructor(private authService: AuthService, private carService: CarService) { }

  ngOnInit(): void {
    // Fetch user name from the auth service or local storage
    this.userName = this.authService.getUser()?.username || 'User';

    // Fetch paginated cars
    this.loadCars();
  }

  // Load cars with pagination
  loadCars(): void {
    this.carService.getAllCars(this.page, this.size).subscribe(
      (response: any) => {
        this.recentCars = response.content; // List of cars for the current page
        this.totalElements = response.totalElements; // Total number of cars
      },
      (error: any) => {
        this.errorMessage = 'Failed to load cars. Please try again later.';
      }
    );
  }

  // Handle page change event
  onPageChange(event: any): void {
    this.page = event.pageIndex; // Update current page
    this.size = event.pageSize; // Update items per page
    this.loadCars(); // Reload cars for the new page
  }
}