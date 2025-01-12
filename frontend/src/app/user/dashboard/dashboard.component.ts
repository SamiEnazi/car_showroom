import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { CarService } from '../../core/services/car.service';
import { ShowroomService } from '../../core/services/showroom.service';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Car } from '../../Interfaces/car';
import { Showroom } from '../../Interfaces/showroom';
import { NotificationsService } from '../../core/services/notifications.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MatPaginatorModule, NgIf, NgFor, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  userName: string = '';
  recentCars: Car[] = []; // Use the Car interface
  allCars: Car[] = []; // Store all cars for filtering
  showrooms: Showroom[] = []; // Store showrooms for the dropdown
  errorMessage: string = '';
  page: number = 0;
  size: number = 5;
  totalElements: number = 0;
  isAdmin: boolean = false;

  // Sorting and filtering properties
  sortBy: string = 'price';
  sortOrder: string = 'asc';
  minPrice: number | null = null;
  maxPrice: number | null = null;
  selectedShowroomId: number | null = null; // Selected showroom ID for filtering

  constructor(
    private authService: AuthService,
    private carService: CarService,
    private showroomService: ShowroomService,
    private router: Router,
    private notifications: NotificationsService
  ) { }

  ngOnInit(): void {
    // Fetch user name from the auth service
    const user = this.authService.getUser();
    this.userName = user?.username || 'User';
    this.isAdmin = this.authService.isAdmin();

    // Fetch showrooms for the dropdown
    this.loadShowrooms();

    // Fetch paginated cars
    this.loadCars();
  }

  // Load showrooms for the dropdown
  loadShowrooms(): void {
    this.showroomService.getAllShowrooms(0, 1000).subscribe(
      (response: any) => {
        this.showrooms = response.content;
        this.notifications.showSuccess('Showrooms loaded successfully!', 'Success');
      },
      (error: any) => {
        this.errorMessage = 'Failed to load showrooms. Please try again later.';
        this.notifications.showError('Failed to load showrooms!', 'Error');
      }
    );
  }

  // Load cars with pagination, sorting, and filtering
  loadCars(): void {
    this.carService
      .getAllCars(
        this.page,
        this.size,
        this.sortBy,
        this.sortOrder,
        this.minPrice || undefined,
        this.maxPrice || undefined
      )
      .subscribe(
        (response: any) => {
          this.allCars = response.content;
          this.totalElements = response.totalElements;
          this.applyShowroomFilter();
          this.notifications.showSuccess('Cars loaded successfully!', 'Success');
        },
        (error: any) => {
          this.errorMessage = 'Failed to load cars. Please try again later.';
          this.notifications.showError('Failed to load cars!', 'Error');
        }
      );
  }

  // Edit showroom (navigate to edit page or open a modal)
  editShowroom(showroomId: number): void {
    this.router.navigate(['/showrooms', showroomId, 'edit']);
    this.notifications.showSuccess('Navigating to edit showroom...', 'Success');
  }

  // Delete showroom
  deleteShowroom(showroomId: number): void {
    if (confirm('Are you sure you want to delete this showroom?')) {
      this.showroomService.deleteShowroom(showroomId).subscribe(
        () => {
          this.showrooms = this.showrooms.filter((showroom) => showroom.id !== showroomId);
          this.notifications.showSuccess('Showroom deleted successfully!', 'Success');
        },
        (error) => {
          this.errorMessage = 'Failed to delete showroom. Please try again later.';
          this.notifications.showError('Failed to delete showroom!', 'Error');
        }
      );
    }
  }

  // Apply showroom filter
  applyShowroomFilter(): void {
    if (this.selectedShowroomId) {
      this.recentCars = this.allCars.filter((car) => car.showroom.id === +this.selectedShowroomId!);
      if (this.recentCars.length === 0) {
        this.notifications.showInfo('No cars found for the selected showroom.', 'Info');
      }
    } else {
      this.recentCars = this.allCars; // Show all cars if no showroom is selected
    }
  }

  // Handle page change event
  onPageChange(event: PageEvent): void {
    this.page = event.pageIndex; // Update current page
    this.size = event.pageSize; // Update items per page
    this.loadCars(); // Reload cars for the new page
  }

  // Apply sorting and filtering
  applyFilters(): void {
    this.page = 0; // Reset to the first page
    this.loadCars();
  }

  // Reset filters
  resetFilters(): void {
    this.sortBy = 'price';
    this.sortOrder = 'asc';
    this.minPrice = null;
    this.maxPrice = null;
    this.selectedShowroomId = null;
    this.applyFilters();
    this.notifications.showSuccess('Filters reset successfully!', 'Success');
  }

  // Handle "View Details" button click
  viewDetails(carId: number): void {
    this.router.navigate(['/cars', carId]);
    this.notifications.showSuccess('Navigating to car details...', 'Success');
  }

  // Handle showroom filter change
  onShowroomFilterChange(): void {
    this.applyShowroomFilter(); // Apply showroom filter when the dropdown selection changes
  }

  // Get cars for a specific showroom
  getCarsForShowroom(showroomId: number): Car[] {
    return this.allCars.filter((car) => car.showroom.id === showroomId);
  }
}