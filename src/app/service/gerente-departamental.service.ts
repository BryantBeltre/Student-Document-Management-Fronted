import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GerenteDepartamentalService {

  constructor(private http: HttpClient) { }

  urlGetApplicationByStatus = 'https://localhost:7249/api/application/filters';
  urlApiCompleteProcess = 'https://localhost:7249/api/application/completeApplications';
  urlApiAddAplication = 'https://localhost:7249/api/application';



  getApplicationDepartamental(status: number): Observable<any> {
    const token = this.getToken();
    const url = `${this.urlGetApplicationByStatus}/?status=${status}`;

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`  // Añadimos el token en el header Authorization
    });

    return this.http.get<any>(url, { headers }).pipe(
      map(response => {
        // Aquí puedes procesar la respuesta si necesitas transformar los datos
        return response;
      }),
      catchError(error => {
        console.error('Error al obtener las aplicaciones por estado', error);
        return throwError(() => new Error('Error al obtener las aplicaciones por estado'));
      })
    );
  }

  // Método para completar el proceso de aplicaciones
  completeApplicationProcess(applicationIds: string[]): Observable<any> {
    const token = this.getToken(); // Obtener el token de autenticación
    const url = `${this.urlApiCompleteProcess}`; // URL del endpoint API

    // Definir los encabezados (headers) para la solicitud
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`, // Añadir el token en el header Authorization
      'Content-Type': 'application/json'  // Asegurarse de que el tipo de contenido es JSON
    });

    // Crear el body de la solicitud
    const body = {
      applicationIds: applicationIds // Enviar la lista de IDs
    };

    // Realizar la solicitud PATCH
    return this.http.patch<any>(url, body, { headers }).pipe(
      map(response => {
        // Puedes procesar la respuesta aquí si es necesario
        return response;
      }),
      catchError(error => {
        // Manejo de errores en la solicitud
        console.error('Error al completar el proceso de aplicación:', error);
        return throwError(() => new Error('Error al completar el proceso de aplicación'));
      })
    );
  }

  getAllAplication(): Observable<any[]> {
    const token = this.getToken(); // Obtén el token JWT del localStorage
  
    if (token) {
      const url = this.urlApiAddAplication;
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}` // Añadimos el token en el header Authorization
      });
  
      // Realizamos la solicitud HTTP GET a la API con los headers
      return this.http.get<any>(url, { headers }).pipe(
        map((response) => {
          // Accedemos a la propiedad 'data' que contiene el array de aplicaciones
          return response.data; 
        }),
        catchError(error => {
          console.error('Error al obtener el total de estados', error);
          return throwError(error);
        })
      );
    } else {
      console.error('No se encontró el token en el localStorage');
      throw new Error('No se encontró el token en el localStorage');
    }
  }


  public getToken(): string {
  const currentUser = JSON.parse(localStorage.getItem('currentUser')!);
  return currentUser?.jwtToken;
}

  public getIdStudent(): string {
  const currentUser = JSON.parse(localStorage.getItem('currentUser')!);
  return currentUser?.id;
}


}
