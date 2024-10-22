import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Service } from '../class/interface/service';
@Injectable({
  providedIn: 'root'
})
export class GetAllServiceService {
  private url = 'https://localhost:7249/api/service';

  constructor(private http: HttpClient) { }

  // Método para obtener todos los servicios
  getAllService(): Observable<Service[]> {
    return this.http.get<{ data: Service[] }>(this.url)
      .pipe(
        map(response => response.data), // Extrae el array 'data' del API
        catchError(this.handleError) // Manejo de errores
      );
  }

  // Método para obtener un servicio por ID
  getServiceById(id: any): Observable<Service | undefined> {
    return this.getAllService().pipe(
      map(services => services.find(service => service.id === id)), // Encuentra el servicio por ID
      catchError(this.handleError) // Manejo de errores
    );
  }

  // Manejo básico de errores
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      console.error('An error occurred:', error.error.message);
    } else {
      // Error del lado del servidor
      console.error(`Backend returned code ${error.status}, body was: ${error.error}`);
    }
    return throwError('Something bad happened; please try again later.');
  }
}
