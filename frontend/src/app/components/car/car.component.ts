import { Component, OnInit } from '@angular/core';
import { CarService } from '../../core/services/car.service';
import { Car } from '../../Interfaces/car';

@Component({
  selector: 'app-car',
  templateUrl: './car.component.html',
  styleUrls: ['./car.component.scss'],
})
export class CarComponent implements OnInit {
  cars: Car[] = [];
  showroomId: number = 0;
  page: number = 0;
  size: number = 10;
  totalElements: number = 0;


  constructor(
    private carService: CarService,
  ) { }

  ngOnInit(): void {
    this.loadCars();
  }


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
    car.showroomId = this.showroomId;
    this.carService.createCar(car).subscribe(() => {
      this.loadCars();
    });
  }
  onPageChange(event: any): void {
    this.page = event.pageIndex;
    this.size = event.pageSize;
    this.loadCars();
  }
  deleteCar(id: number): void {
    this.carService.deleteCar(id).subscribe(() => {
      this.loadCars();
    });
  }
}