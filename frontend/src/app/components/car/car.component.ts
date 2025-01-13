import { Component, OnInit } from '@angular/core';
import { CarService } from '../../core/services/car.service';
import { Car } from '../../Interfaces/car';
import { NotificationsService } from '../../core/services/notifications.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { Showroom } from '../../Interfaces/showroom';
import { Router } from '@angular/router';
import { ShowroomService } from '../../core/services/showroom.service';

@Component({
  selector: 'app-car',
  standalone: true,
  imports: [FormsModule, CommonModule, MatPaginatorModule],
  templateUrl: './car.component.html',
  styleUrls: ['./car.component.scss'],
})
export class CarComponent implements OnInit {
  cars: Car[] = [];
  showrooms: Showroom[] = [];
  isLoading: boolean = false;
  error: string | null = null;

  // Pagination
  page: number = 0;
  size: number = 10;
  totalElements: number = 0;

  // Filters
  selectedShowroomId: number | null = null;

  // Form
  newCar: Car = this.getEmptyCarObject();

  constructor(
    private carService: CarService,
    private showroomService: ShowroomService,
    private notifications: NotificationsService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadShowrooms();
    this.loadCars();
  }

  private getEmptyCarObject(): Car {
    return {
      id: 0,
      vin: '',
      maker: '',
      model: '',
      modelYear: new Date().getFullYear(),
      price: 0,
      showroom: {} as Showroom,
      showroomId: 0,
    };
  }

  loadShowrooms(): void {
    this.isLoading = true;

    this.showroomService.getAllShowrooms(0, 1000).subscribe({
      next: (response: any) => {
        this.showrooms = response.content;
        this.isLoading = false;
      },
      error: (error) => {
        this.error = 'Failed to load showrooms';
        this.isLoading = false;
        this.notifications.showError('Failed to load showrooms', 'Error');
        console.error('Error loading showrooms:', error);
      }
    });
  }

  loadCars(): void {
    this.isLoading = true;
    this.error = null;

    const params = {
      page: this.page,
      size: this.size,
      showroomId: this.selectedShowroomId
    };

    this.carService.getAllCars(params).subscribe({
      next: (response: any) => {
        this.cars = response.content;
        this.totalElements = response.totalElements;
        this.isLoading = false;
      },
      error: (error) => {
        this.error = 'Failed to load cars';
        this.isLoading = false;
        this.notifications.showError('Failed to load cars', 'Error');
        console.error('Error loading cars:', error);
      }
    });
  }

  onShowroomChange(): void {
    this.page = 0; // Reset to first page when changing showroom
    this.loadCars();
  }

  onPageChange(event: PageEvent): void {
    this.page = event.pageIndex;
    this.size = event.pageSize;
    this.loadCars();
  }

  addCar(): void {
    if (!this.selectedShowroomId) {
      this.notifications.showError('Please select a showroom', 'Error');
      return;
    }

    if (!this.validateCar(this.newCar)) {
      return;
    }

    this.newCar.showroomId = this.selectedShowroomId;
    this.isLoading = true;

    this.carService.createCar(this.newCar).subscribe({
      next: () => {
        this.notifications.showSuccess('Car added successfully', 'Success');
        this.resetForm();
        this.loadCars();
      },
      error: (error) => {
        this.isLoading = false;
        if (error.error) {
          const errorMessages = Object.values(error.error).join(', ');
          this.notifications.showError(errorMessages, 'Error');
        } else {
          this.notifications.showError('Failed to add car', 'Error');
        }
        console.error('Error adding car:', error);
      }
    });
  }

  private validateCar(car: Car): boolean {
    if (!car.vin || car.vin.trim() === '') {
      this.notifications.showError('VIN is required', 'Error');
      return false;
    }
    if (!car.maker || car.maker.trim() === '') {
      this.notifications.showError('Maker is required', 'Error');
      return false;
    }
    if (!car.model || car.model.trim() === '') {
      this.notifications.showError('Model is required', 'Error');
      return false;
    }
    if (!car.modelYear || car.modelYear < 1900) {
      this.notifications.showError('Please enter a valid year', 'Error');
      return false;
    }
    if (!car.price || car.price <= 0) {
      this.notifications.showError('Please enter a valid price', 'Error');
      return false;
    }
    return true;
  }

  editCar(carId: number): void {
    this.router.navigate(['/cars', carId, 'edit']);
  }

  deleteCar(id: number): void {
    if (!confirm('Are you sure you want to delete this car?')) {
      return;
    }

    this.isLoading = true;
    this.carService.deleteCar(id).subscribe({
      next: () => {
        this.notifications.showSuccess('Car deleted successfully', 'Success');
        this.loadCars();
      },
      error: (error) => {
        this.isLoading = false;
        if (error.error) {
          const errorMessages = Object.values(error.error).join(', ');
          this.notifications.showError(errorMessages, 'Error');
        } else {
          this.notifications.showError('Failed to delete car', 'Error');
        }
        console.error('Error deleting car:', error);
      }
    });
  }

  resetForm(): void {
    this.newCar = this.getEmptyCarObject();
    this.selectedShowroomId = null;
  }
}