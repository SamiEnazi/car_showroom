import { Component, OnDestroy, OnInit } from '@angular/core';

import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil, catchError, EMPTY } from 'rxjs';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

import { ShowroomService } from '../../../core/services/showroom.service';
import { CarService } from '../../../core/services/car.service';
import { NotificationsService } from '../../../core/services/notifications.service';
import { Showroom } from '../../../Interfaces/showroom';
import { Car } from '../../../Interfaces/car';

@Component({
  selector: 'app-showroom-details',
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    AsyncPipe,
    RouterModule,
    MatPaginatorModule
  ],
  templateUrl: './showroom-details.component.html'
})
export class ShowroomDetailsComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  showroom: Showroom | null = null;
  cars: Car[] = [];
  errorMessage: string = '';

  // Pagination for cars
  page: number = 0;
  size: number = 6;
  totalElements: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private showroomService: ShowroomService,
    private carService: CarService,
    private notifications: NotificationsService
  ) { }

  ngOnInit(): void {
    const showroomId = this.route.snapshot.paramMap.get('id');
    if (showroomId) {
      this.loadShowroomDetails(+showroomId);
      this.loadShowroomCars(+showroomId);
    } else {
      this.router.navigate(['/']);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadShowroomDetails(showroomId: number): void {
    this.showroomService.getShowroomById(showroomId)
      .pipe(
        takeUntil(this.destroy$),
        catchError(error => {
          this.notifications.showError('Failed to load showroom details', 'Error');
          this.router.navigate(['/']);
          return EMPTY;
        })
      )
      .subscribe(showroom => {
        this.showroom = showroom;
      });
  }

  private loadShowroomCars(showroomId: number): void {
    const params = {
      page: this.page,
      size: this.size,
      showroomId: showroomId
    };

    this.carService.getAllCars(params)
      .pipe(
        takeUntil(this.destroy$),
        catchError(error => {
          this.notifications.showError('Failed to load cars', 'Error');
          return EMPTY;
        })
      )
      .subscribe(response => {
        this.cars = response.content;
        this.totalElements = response.totalElements;
      });
  }

  onPageChange(event: PageEvent): void {
    this.page = event.pageIndex;
    this.size = event.pageSize;
    this.loadShowroomCars(this.showroom!.id);
  }

  viewCarDetails(carId: number): void {
    this.router.navigate(['/cars', carId]);
  }
  backToShowrooms(): void {
    this.router.navigate(['/showrooms']);
  }

}