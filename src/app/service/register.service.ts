import { Injectable } from '@angular/core';

import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { UserEntity } from '../class/user-entity';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  private apiUrl = 'https://localhost:7249/api/student/register';
  private urlGetAll = 'https://localhost:7249/api/user';


  constructor(private http: HttpClient) { }

  registerStudent(formData: FormData): Observable<any> {
    return this.http.post<any>(this.apiUrl, formData)
      .pipe(
        map(response => {
          console.log('Registro de estudiante exitoso:', response);
          return response;
        }),
        catchError(this.handleError)
      );
  }

  // Manejo de errores
  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('Error en la solicitud:', error);
    return throwError(error.message || 'Error en el servidor. Inténtalo nuevamente más tarde.');
  }

  getUserById(): Observable<UserEntity> {
    // Obtener el string almacenado bajo la clave 'currentUser'
    const currentUser = localStorage.getItem('currentUser');

    if (!currentUser) {
      throw new Error('User is not logged in');
    }

    // Parsear el string para convertirlo en un objeto
    const parsedUser = JSON.parse(currentUser);

    // Obtener el token JWT y el id del usuario
    const userId = parsedUser.id;
    const token = parsedUser.jwtToken;
    console.log(userId);

    if (!userId || !token) {
      throw new Error('User ID or token is missing');
    }

/*     const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
 */
    // Realiza la petición GET a la API para obtener los datos del estudiante
    console.log(this.http.get<UserEntity>(`${this.urlGetAll}/${userId}`));
    return this.http.get<UserEntity>(`${this.urlGetAll}/${userId}`);
  }


  // Método para obtener un listado de todos los usuarios
  getAllUsers(): Observable<{ data: UserEntity[], message: string, success: boolean }> {
    return this.http.get<{ data: UserEntity[], message: string, success: boolean }>(this.urlGetAll);
  }
}


