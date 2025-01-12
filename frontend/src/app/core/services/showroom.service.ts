import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, shareReplay } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Showroom } from '../../Interfaces/showroom';

@Injectable({
  providedIn: 'root',
})
export class ShowroomService {
  private PublicApiUrl = `${environment.apiUrl}/public/showrooms`;
  private AdminApiUrl = `${environment.apiUrl}/admin/showrooms`;

  // Cache for getAllShowrooms
  private allShowroomsCache$: Observable<Showroom[]> | null = null;

  constructor(private http: HttpClient) { }

  // Get all showrooms with caching
  getAllShowrooms(page: number, size: number): Observable<any> {
    const cacheKey = `${page}-${size}`;

    if (!this.allShowroomsCache$) {
      const params = new HttpParams()
        .set('page', page.toString())
        .set('size', size.toString());

      this.allShowroomsCache$ = this.http.get<any>(this.PublicApiUrl, { params })
        .pipe(shareReplay(1));
    }

    return this.allShowroomsCache$;
  }

  // Get a single showroom by ID
  getShowroomById(id: number): Observable<Showroom> {
    return this.http.get<Showroom>(`${this.PublicApiUrl}/${id}`);
  }

  // Create a new showroom
  createShowroom(showroom: Showroom): Observable<Showroom> {
    this.allShowroomsCache$ = null; // Invalidate cache
    return this.http.post<Showroom>(`${this.AdminApiUrl}/create`, showroom);
  }

  // Update an existing showroom
  updateShowroom(id: number, showroom: Showroom): Observable<Showroom> {
    this.allShowroomsCache$ = null; // Invalidate cache
    return this.http.put<Showroom>(`${this.AdminApiUrl}/update/${id}`, showroom);
  }

  // Delete a showroom
  deleteShowroom(id: number): Observable<void> {
    this.allShowroomsCache$ = null; // Invalidate cache
    return this.http.delete<void>(`${this.AdminApiUrl}/delete/${id}`);
  }
}