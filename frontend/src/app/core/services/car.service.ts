import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, shareReplay } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Car } from '../../Interfaces/car';

@Injectable({
  providedIn: 'root',
})
export class CarService {
  private AdminApiUrl = `${environment.apiUrl}/admin/cars`;
  private publicApiUrl = `${environment.apiUrl}/public/cars`;

  // Cache for getAllCars
  private allCarsCache$: Observable<any> | null = null;

  // Cache for getCarsByShowroom
  private carsByShowroomCache = new Map<string, Observable<any>>();

  constructor(private http: HttpClient) { }

  // Create a new car
  createCar(car: Car): Observable<Car> {
    // Invalidate the cache when a new car is created
    this.allCarsCache$ = null;
    return this.http.post<Car>(`${this.AdminApiUrl}/create`, car);
  }

  // Get cars by showroom with caching
  getCarsByShowroom(showroomId: number, page: number, size: number): Observable<any> {
    const cacheKey = `${showroomId}-${page}-${size}`;

    if (!this.carsByShowroomCache.has(cacheKey)) {
      const params = new HttpParams()
        .set('page', page.toString())
        .set('size', size.toString());

      const request$ = this.http.get<any>(`${this.publicApiUrl}/showroom/${showroomId}`, { params })
        .pipe(shareReplay(1)); // Cache the response

      this.carsByShowroomCache.set(cacheKey, request$);
    }

    return this.carsByShowroomCache.get(cacheKey)!;
  }

  // Get all cars with caching
  getAllCars(
    page: number,
    size: number,
    sortBy?: string,
    sortOrder?: string,
    minPrice?: number,
    maxPrice?: number
  ): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (sortBy) params = params.set('sortBy', sortBy);
    if (sortOrder) params = params.set('sortOrder', sortOrder);
    if (minPrice) params = params.set('minPrice', minPrice.toString());
    if (maxPrice) params = params.set('maxPrice', maxPrice.toString());

    return this.http.get<any>(this.publicApiUrl, { params });
  }

  // Update a car
  updateCar(id: number, car: Car): Observable<Car> {
    // Invalidate the cache when a car is updated
    this.allCarsCache$ = null;
    car.showroomId = car.showroom.id;
    return this.http.put<Car>(`${this.AdminApiUrl}/update/${id}`, car);
  }

  // Delete a car
  deleteCar(id: number): Observable<void> {
    // Invalidate the cache when a car is deleted
    this.allCarsCache$ = null;
    return this.http.delete<void>(`${this.AdminApiUrl}/delete/${id}`);
  }
}