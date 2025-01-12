import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CarService } from '../../../core/services/car.service';
import { Car } from '../../../Interfaces/car';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

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
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private carService: CarService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    const carId = this.route.snapshot.paramMap.get('id');
    if (carId) {
      this.loadCarDetails(+carId);
    }
    this.isAdmin = this.authService.isAdmin();
  }

  loadCarDetails(carId: number): void {
    this.carService.getAllCars(0, 10).subscribe((response) => {
      this.car = response.content.find((car: Car) => car.id === carId) || null;
    });
  }

  editCar(): void {
    if (this.car) {
      this.router.navigate(['/cars', this.car.id, 'edit']);
    }
  }

  deleteCar(): void {
    if (this.car) {
      this.carService.deleteCar(this.car.id).subscribe(() => {
        this.router.navigate(['/dashboard']);
      });
    }
  }
}