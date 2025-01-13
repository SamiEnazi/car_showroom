import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, Observable, shareReplay, throwError } from 'rxjs';
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

  getAllCars(params: {
    page: number;
    size: number;
    sortBy?: string;
    sortOrder?: string;
    minPrice?: number | null;
    maxPrice?: number | null;
    showroomId?: number | null;
  }): Observable<any> {
    let httpParams = new HttpParams()
      .set('page', params.page.toString())
      .set('size', params.size.toString());

    if (params.sortBy) httpParams = httpParams.set('sortBy', params.sortBy);
    if (params.sortOrder) httpParams = httpParams.set('sortOrder', params.sortOrder);
    if (params.minPrice) httpParams = httpParams.set('minPrice', params.minPrice.toString());
    if (params.maxPrice) httpParams = httpParams.set('maxPrice', params.maxPrice.toString());
    if (params.showroomId) httpParams = httpParams.set('showroomId', params.showroomId.toString());

    return this.http.get<any>(this.publicApiUrl, { params: httpParams });
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
    return this.http.delete<void>(`${this.AdminApiUrl}/delete/${id}`).pipe(
      catchError(error => {
        console.error('Delete showroom error:', error);
        return throwError(() => error);
      })
    );
  }

  getCarById(id: number): Observable<Car> {
    return this.http.get<Car>(`${this.publicApiUrl}/${id}`);
  }
}