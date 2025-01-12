import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CarService } from '../../../core/services/car.service';
import { Car } from '../../../Interfaces/car';
import { MatPaginatorModule } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-showroom-cars',
  standalone: true,
  imports: [MatPaginatorModule, RouterModule, CommonModule],
  templateUrl: './showroom-cars.component.html',
  styleUrls: ['./showroom-cars.component.scss'],
})
export class ShowroomCarsComponent implements OnInit {
  cars: Car[] = [];
  showroomId: number = 0;
  page: number = 0;
  size: number = 10;
  totalElements: number = 0;

  constructor(
    private route: ActivatedRoute,
    private carService: CarService
  ) { }

  ngOnInit(): void {
    this.showroomId = +this.route.snapshot.paramMap.get('id')!;
    this.loadCars();
  }

  loadCars(): void {
    this.carService.getCarsByShowroom(this.showroomId, this.page, this.size).subscribe((response) => {
      this.cars = response.content;
      this.totalElements = response.totalElements;
    });
  }

  onPageChange(event: any): void {
    this.page = event.pageIndex;
    this.size = event.pageSize;
    this.loadCars();
  }
}