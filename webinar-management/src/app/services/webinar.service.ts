import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Webinar {
  id?: string;
  webinarName: string;
  type: 'Single Session' | 'Multi Session';
  sessionType: string;
  startDate: string;
  endDate: string;
  startTime: string;
  duration: number;
  timeZone: string;
  eventLanguage: string;
  status?: 'draft' | 'published';
  createdAt?: string;
  updatedAt?: string;
}

@Injectable({
  providedIn: 'root',
})
export class WebinarService {
  private apiUrl = 'http://localhost:3000/api/webinars';

  constructor(private http: HttpClient) {}

  // Create a new webinar
  createWebinar(webinarData: Webinar): Observable<Webinar> {
    return this.http.post<Webinar>(this.apiUrl, webinarData);
  }

  // Get a webinar by ID
  getWebinar(id: string): Observable<Webinar> {
    return this.http.get<Webinar>(`${this.apiUrl}/${id}`);
  }

  // Get all webinars
  getAllWebinars(): Observable<Webinar[]> {
    return this.http.get<Webinar[]>(this.apiUrl);
  }

  // Update a webinar
  updateWebinar(id: string, webinarData: Webinar): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, webinarData);
  }

  // Delete a webinar
  deleteWebinar(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
