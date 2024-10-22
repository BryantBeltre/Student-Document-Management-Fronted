import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map,catchError } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ReceptionFilesService {

  constructor(private http: HttpClient) { }
  urlApiFiltersReuest = 'https://localhost:7249/api/application/filters';  
  urlApiChangeStatus = 'https://localhost:7249/api/studentFile/change-status';

  getRequest(status: number):Observable<any>{
    const token = this.getToken();
    if(token){
      const url = `${this.urlApiFiltersReuest}?status=${status}`;
      // Configuramos los headers con el token JWT
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`  // Añadimos el token en el header Authorization
      });

      return this.http.get(url, {headers}).pipe(
        catchError(error => {
          console.error('Error al obtener los datos del estudiante', error);
          return throwError(error);
        })
      );

    } else {
      // Si no hay un studentId o token en el localStorage, manejamos el error aquí
      console.error('No se encontró el studentId o el token en el localStorage');
      throw new Error('No se encontró el studentId o el token en el localStorage');
    }

  }

  changeStatus(idFile: string, status: number): Observable<any> {
    const token = this.getToken();
    
    if (token) {
      const url = `${this.urlApiChangeStatus}/${idFile}`;
      const body = { status };  // Enviar como objeto
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'  // Asegurarse de que el contenido es JSON
      });
  
      return this.http.patch(url, body, { headers }).pipe(
        catchError(error => {
          console.error('Error al cambiar el estado del archivo', error);
          return throwError(() => new Error(error));
        })
      );
    } else {
      return throwError(() => new Error('Token no disponible'));
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
