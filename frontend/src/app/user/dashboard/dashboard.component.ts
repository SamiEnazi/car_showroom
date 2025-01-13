import { Component, OnInit, OnDestroy } from '@angular/core';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { Subject, takeUntil } from 'rxjs';
import { map } from 'rxjs/operators';

import { AuthService } from '../../core/services/auth.service';
import { CarService } from '../../core/services/car.service';
import { ShowroomService } from '../../core/services/showroom.service';
import { NotificationsService } from '../../core/services/notifications.service';
import { Car } from '../../Interfaces/car';
import { Showroom } from '../../Interfaces/showroom';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    MatPaginatorModule,
    NgIf,
    NgFor,
    FormsModule,
    AsyncPipe
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  user$ = this.authService.user$;
  isAdmin$ = this.user$.pipe(
    map(user => user?.role === 'ADMIN')
  );

  recentCars: Car[] = [];
  showrooms: Showroom[] = [];
  errorMessage: string = '';

  // Pagination
  page: number = 0;
  size: number = 5;
  totalElements: number = 0;

  // Sorting and filtering
  sortBy: string = 'price';
  sortOrder: string = 'asc';
  minPrice: number | null = null;
  maxPrice: number | null = null;
  selectedShowroomId: number | null = null;

  constructor(
    private authService: AuthService,
    private carService: CarService,
    private showroomService: ShowroomService,
    private router: Router,
    private notifications: NotificationsService
  ) { }

  ngOnInit(): void {
    this.loadShowrooms();
    this.loadCars();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadShowrooms(): void {
    this.showroomService.getAllShowrooms(0, 1000).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (response: any) => {
        this.showrooms = response.content;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load showrooms. Please try again later.';
        this.notifications.showError('Failed to load showrooms!', 'Error');
      }
    });
  }

  loadCars(): void {
    const params = {
      page: this.page,
      size: this.size,
      sortBy: this.sortBy,
      sortOrder: this.sortOrder,
      minPrice: this.minPrice,
      maxPrice: this.maxPrice,
      showroomId: this.selectedShowroomId
    };

    this.carService.getAllCars(params).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (response: any) => {
        this.recentCars = response.content;
        this.totalElements = response.totalElements;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load cars. Please try again later.';
        this.notifications.showError('Failed to load cars!', 'Error');
      }
    });
  }

  onPageChange(event: PageEvent): void {
    this.page = event.pageIndex;
    this.size = event.pageSize;
    this.loadCars();
  }

  resetFilters(): void {
    this.sortBy = 'price';
    this.sortOrder = 'asc';
    this.minPrice = null;
    this.maxPrice = null;
    this.selectedShowroomId = null;
    this.page = 0;
    this.loadCars();
    this.notifications.showSuccess('Filters reset successfully!', 'Success');
  }

  onShowroomFilterChange(): void {
    this.page = 0;
    this.loadCars();
  }

  viewDetails(carId: number): void {
    this.router.navigate(['/cars', carId]);
  }

  editCar(carId: number): void {
    this.router.navigate(['/cars', carId, 'edit']);
  }

  deleteCar(carId: number): void {
    if (confirm('Are you sure you want to delete this car?')) {
      this.carService.deleteCar(carId).pipe(
        takeUntil(this.destroy$)
      ).subscribe({
        next: () => {
          this.loadCars();
          this.notifications.showSuccess('Car deleted successfully!', 'Success');
        },
        error: () => {
          this.notifications.showError('Failed to delete car!', 'Error');
        }
      });
    }
  }
}