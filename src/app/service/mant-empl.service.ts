import { Injectable } from '@angular/core';

import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { UserAdminEntity } from '../class/user-admin-entity';

@Injectable({
  providedIn: 'root'
})
export class MantEmplService {

  private apiUrl = 'https://localhost:7249/api/user/register';

  constructor(private http: HttpClient) { }

  saveUser(formData: FormData): Observable<any> {
    return this.http.post<any>(this.apiUrl, formData)
      .pipe(
        map(response => {
          console.log('Registro de estudiante exitoso:', response);
          return response;
        }),
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('Error en la solicitud:', error);
    return throwError(error.message || 'Error en el servidor. Inténtalo nuevamente más tarde.');
  }
}
