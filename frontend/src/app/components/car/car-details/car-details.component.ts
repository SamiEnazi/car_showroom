import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CarService } from '../../../core/services/car.service';
import { Car } from '../../../Interfaces/car';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationsService } from '../../../core/services/notifications.service';

@Component({
  selector: 'app-car-details',
  templateUrl: './car-details.component.html',
  standalone: true,
  imports: [FormsModule, CommonModule],
  styleUrls: ['./car-details.component.scss'],
})
export class CarDetailsComponent implements OnInit {
  car: Car | null = null;
  isAdmin: boolean = false;
  isLoading: boolean = false;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private carService: CarService,
    private authService: AuthService,
    private notifications: NotificationsService
  ) { }

  ngOnInit(): void {
    const carId = this.route.snapshot.paramMap.get('id');
    if (carId) {
      this.loadCarDetails(+carId);
    }
    this.isAdmin = this.authService.isAdmin();
  }

  loadCarDetails(carId: number): void {
    this.isLoading = true;
    this.error = null;

    this.carService.getCarById(carId).subscribe({
      next: (car) => {
        this.car = car;
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.error = 'Failed to load car details';
        this.notifications.showError('Failed to load car details', 'Error');
        console.error('Error loading car:', error);
      }
    });
  }

  editCar(): void {
    if (this.car) {
      this.router.navigate(['/cars', this.car.id, 'edit']);
    }
  }

  deleteCar(): void {
    if (this.car && confirm('Are you sure you want to delete this car?')) {
      this.carService.deleteCar(this.car.id).subscribe({
        next: () => {
          //this.notifications.showSuccess('Car deleted successfully', 'Success');
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.notifications.showError('Failed to delete car', 'Error');
          console.error('Error deleting car:', error);
        }
      });
    }
  }
}