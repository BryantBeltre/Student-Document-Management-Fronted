import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
/* import { UserEntity } from '../class/user-entity';
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://localhost:7249/api/account/login'; 

  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;

  constructor(private http: HttpClient) {
    const storageItem = typeof window !== 'undefined' ? localStorage.getItem('currentUser') : null;
    this.currentUserSubject = new BehaviorSubject<any>(storageItem ? JSON.parse(storageItem) : null);
    this.currentUser = this.currentUserSubject.asObservable();
  }

  // Método para verificar si estamos en un entorno de navegador
  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  isLoggedIn(): boolean {
    if (this.isBrowser()) {
      return !!localStorage.getItem('currentUser'); // Si hay un token en localStorage, el usuario está autenticado
    }
    return false; // Si no es un navegador, no está autenticado
  }

  public get currentUserValue() {
    return this.currentUserSubject.value;
  }

  login(userName: string, password: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = JSON.stringify({ userName, password });
  
    return this.http.post<any>(this.apiUrl, body, { headers })
      .pipe(
        map(response => {
          if (response.success && response.data.jwtToken) {
            localStorage.setItem('currentUser', JSON.stringify(response.data));
            this.currentUserSubject.next(response.data);
          }
          return response;
        }),
        catchError(error => {
          const errorMessage = error.error?.message || 'Ha ocurrido un error. Inténtalo nuevamente.';
          
          // Simplemente lanzar el error con el mensaje del servidor
          return throwError(() => new Error(errorMessage));
        })
      );
  }

  logout() {
    // Eliminar los datos del usuario del localStorage y reiniciar currentUserSubject
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  // Método para obtener el token
  public getToken(): string {
    const currentUser = JSON.parse(localStorage.getItem('currentUser')!);
    return currentUser?.jwtToken;
  }

/*   getStudentById(): Observable<UserEntity> {
    const userId = localStorage.getItem('Id');

    if (!userId) {
      throw new Error('User ID is missing');
    }

    // Realiza la petición GET a la API para obtener los datos del estudiante sin token
    return this.http.get<UserEntity>(`${this.apiUrlGet}/${userId}`);
  } */

}
