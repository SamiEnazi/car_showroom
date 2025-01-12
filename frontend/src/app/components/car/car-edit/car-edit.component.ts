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
    this.carService.getAllCars(0, 10).subscribe((response) => {
      this.car = response.content.find((car: Car) => car.id === carId) || null;
    });
  }

  updateCar(): void {
    if (this.car) {
      this.carService.updateCar(this.car.id, this.car).subscribe(() => {
        this.router.navigate(['/cars', this.car?.id]);
        this.notifications.showSuccess('Car Updated Successfully!', 'Success');
      }, (error) => {
        console.error(error);
        if (error.error) {
          const errorMessages = Object.values(error.error).join(', ');
          this.notifications.showError(errorMessages, 'Error');
        } else if (error.status) {
          this.notifications.showError('Unauthorized!', 'Error');
        } else {
          this.notifications.showError('An error occurred while updating the car!', 'Error');
        }
      });
    }
  }
}