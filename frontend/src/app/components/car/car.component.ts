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
  showroomId: number = 0;
  page: number = 0;
  size: number = 10;
  totalElements: number = 0;
  isDarkMode: boolean = false;
  showrooms: Showroom[] = [];
  selectedShowroomId: number | null = null;
  showroomPage: number = 0;
  showroomSize: number = 100; // Adjust based on your API's max page size
  showroomTotalElements: number = 0;
  // Define the newCar property and initialize it with default values
  newCar: Car = {
    id: 0,
    vin: '',
    maker: '',
    model: '',
    modelYear: 0,
    price: 0,
    showroom: {} as Showroom,
    showroomId: 0,
  };

  constructor(
    private carService: CarService,
    private showroomService: ShowroomService,
    private notification: NotificationsService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadCars();
    this.loadShowrooms();
    this.checkDarkMode();
  }
  // Load all showrooms for the dropdown
  loadShowrooms(): void {
    this.showroomService.getAllShowrooms(this.showroomPage, this.showroomSize).subscribe(
      (response: any) => {
        this.showrooms = [...this.showrooms, ...response.content]; // Append new showrooms
        this.showroomTotalElements = response.totalElements;

        // If there are more showrooms to load, fetch the next page
        if (this.showrooms.length < this.showroomTotalElements) {
          this.showroomPage++;
          this.loadShowrooms();
        }
      },
      (error) => {
        this.notification.showError('Failed to load showrooms.', 'Error');
      }
    );
  }
  // Load cars based on pagination and showroom ID
  loadCars(): void {
    if (this.showroomId > 0) {
      this.carService.getCarsByShowroom(this.showroomId, this.page, this.size).subscribe((response) => {
        this.cars = response.content;
        this.totalElements = response.totalElements;
      });
    } else {
      this.carService.getAllCars(this.page, this.size).subscribe((response) => {
        this.cars = response.content;
        this.totalElements = response.totalElements;
      });
    }
  }

  addCar(car: Car): void {
    if (!this.selectedShowroomId) {
      this.notification.showError('Please select a showroom before adding a car.', 'Error');
      return;
    }

    // Set the showroomId for the new car
    car.showroomId = this.selectedShowroomId;

    this.carService.createCar(car).subscribe(
      () => {
        this.loadCars(); // Refresh the car list
        this.resetNewCarForm(); // Reset the form
        this.notification.showSuccess('Car added successfully!', 'Success');
      },
      (error) => {
        this.notification.showError('Failed to add car. Please try again.', 'Error');
      }
    );
  }
  editCar(carId: number): void {
    this.router.navigate(['/cars', carId, 'edit']);
    this.notification.showSuccess('Navigating to edit car...', 'Success');
  }
  // Reset the newCar form
  resetNewCarForm(): void {
    this.newCar = {
      id: 0,
      vin: '',
      maker: '',
      model: '',
      modelYear: 0,
      price: 0,
      showroom: {} as Showroom,
      showroomId: 0,
    };
  }

  // Handle pagination changes
  onPageChange(event: any): void {
    this.page = event.pageIndex;
    this.size = event.pageSize;
    this.loadCars();
  }

  // Delete a car
  deleteCar(id: number): void {
    this.carService.deleteCar(id).subscribe(
      (response) => {
        this.loadCars();
        this.notification.showSuccess('Car deleted successfully!', 'Success');
      },
      (error) => {
        if (error.error) {
          const errorMessages = Object.values(error.error).join(', ');
          this.notification.showError(errorMessages, 'Error');
        } else {
          this.notification.showError('An error occurred while deleting the car.', 'Error');
        }
      }
    );
  }

  // Check and apply dark mode
  checkDarkMode(): void {
    this.isDarkMode = document.documentElement.classList.contains('dark');
  }

  // Toggle dark mode
  toggleDarkMode(): void {
    this.isDarkMode = !this.isDarkMode;
    if (this.isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }
}