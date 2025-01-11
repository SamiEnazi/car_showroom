import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Showroom } from '../../Interfaces/showroom';

@Injectable({
  providedIn: 'root',
})
export class ShowroomService {
  private apiUrl = `${environment.apiUrl}/api/showrooms`;

  constructor(private http: HttpClient) { }

  getAllShowrooms(page: number, size: number): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<any>(this.apiUrl, { params });
  }

  // Other methods remain unchanged
}