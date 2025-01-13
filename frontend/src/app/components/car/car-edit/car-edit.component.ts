import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CarService } from '../../../core/services/car.service';
import { Car } from '../../../Interfaces/car';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NotificationsService } from '../../../core/services/notifications.service';

@Component({
  selector: 'app-car-edit',
  templateUrl: './car-edit.component.html',
  standalone: true,
  imports: [FormsModule, CommonModule],
  styleUrls: ['./car-edit.component.scss'],
})
export class CarEditComponent implements OnInit {
  car: Car | null = null;
  isLoading: boolean = false;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private carService: CarService,
    private notifications: NotificationsService,
  ) { }

  ngOnInit(): void {
    const carId = this.route.snapshot.paramMap.get('id');
    if (carId) {
      this.loadCarDetails(+carId);
    }
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

  updateCar(): void {
    if (this.car) {
      this.carService.updateCar(this.car.id, this.car).subscribe({
        next: () => {
          this.notifications.showSuccess('Car Updated Successfully!', 'Success');
          this.router.navigate(['/cars', this.car?.id]);
        },
        error: (error) => {
          console.error('Error updating car:', error);
          if (error.error) {
            const errorMessages = Object.values(error.error).join(', ');
            this.notifications.showError(errorMessages, 'Error');
          } else if (error.status === 401) {
            this.notifications.showError('Unauthorized!', 'Error');
          } else {
            this.notifications.showError('An error occurred while updating the car!', 'Error');
          }
        }
      });
    }
  }
}