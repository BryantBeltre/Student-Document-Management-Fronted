import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { error } from 'node:console';

@Injectable({
  providedIn: 'root'
})
export class StudentFileService {

  constructor(private http: HttpClient) { }

  urlApiAddFile = 'https://localhost:7249/api/studentFile/add-file';
  urlApiAddAplication = 'https://localhost:7249/api/application';
  urlApiGetStatusByStudent = 'https://localhost:7249/api/application/filters';  // La URL base de la API
  urlApiUpdateFile = 'https://localhost:7249/api/studentFile/update-file';
  urlApiPayApplication = 'https://localhost:7249/api/application/pay';

  // Método para enviar los archivos al servidor
  uploadFiles(formData: FormData): Observable<any> {
    // Obtener el token JWT del localStorage
    const token = this.getToken();

    // Configurar las cabeceras con el token de autorización
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    const values = formData.getAll('file');

    // Hacer la solicitud HTTP POST con las cabeceras
    return this.http.post<any>(this.urlApiAddFile, formData, { headers })
      .pipe(
        map(response => {
          console.log('Archivo subido exitosamente:', response);
          return response; // Retorna la respuesta exitosa
        }),
        catchError(error => {
          console.error('Error al subir el archivo:', error);
          return throwError(() => new Error('Error al subir el archivo')); // Manejo de errores
        })
      );
  }

  saveAplication(serviceId: string, files: Array<{ studentFileId: string }>): Observable<any> {
    const token = this.getToken(); // Obtener el token JWT del localStorage

    // Cabeceras de la solicitud con el token de autorización
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    // Estructura del body de la solicitud
    const body = {
      serviceId: serviceId,
      files: files
    };

    // Hacer la solicitud HTTP POST
    return this.http.post<any>(this.urlApiAddAplication, body, { headers }).pipe(
      map(response => {
        console.log('Archivos guardados exitosamente:', response);
        return response;
      }),
      catchError(error => {
        console.error('Error al guardar los archivos:', error);
        return throwError(() => new Error('Error al guardar los archivos'));
      })
    );
  }

  // Método para obtener el estado de un estudiante basado en su ID
  // Método para obtener el estado del estudiante por ID, incluyendo el token en la solicitud
  getStatusByStudentId(): Observable<any> {
    const studentId = this.getIdStudent();  // Obtén el studentId del localStorage
    const token = this.getToken();  // Obtén el token JWT del localStorage

    if (studentId && token) {
      // Si el studentId y el token existen en el localStorage, construimos la URL con el parámetro
      const url = `${this.urlApiGetStatusByStudent}?studentId=${studentId}`;

      // Configuramos los headers con el token JWT
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`  // Añadimos el token en el header Authorization
      });

      // Realizamos la solicitud HTTP GET a la API con los headers
      return this.http.get(url, { headers }).pipe(
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

  updateFile(fileId: string, formData : FormData){
    const token = this.getToken(); 
    const url = `${this.urlApiUpdateFile}/${fileId}`;

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`  // Añadimos el token en el header Authorization
    });

    return this.http.put<any>(url, formData, {headers})
    .pipe(
      map(response => {
        console.log('Registro de estudiante exitoso:', response);
        return response;
      }),
      catchError(error => {
        console.error('Error al guardar los archivos:', error);
        return throwError(() => new Error('Error al guardar los archivos'));
      })
    );

  }


  payApplicationRequest(idApplication : any): Observable<any>{
    const token = this.getToken();
    const url = `${this.urlApiPayApplication}/${idApplication}`;

    
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`  // Añadimos el token en el header Authorization
    });

    return this.http.patch<any>(url, {} ,{headers})
    .pipe(
      map(response => {
        return response;
      }),
      catchError(error =>{
        return throwError(()=> new Error('Error al pagar la solicitud'))
      })
    )

  }

  // Método para obtener el token JWT
  public getToken(): string {
    const currentUser = JSON.parse(localStorage.getItem('currentUser')!);
    return currentUser?.jwtToken;
  }

  public getIdStudent(): string {
    const currentUser = JSON.parse(localStorage.getItem('currentUser')!);
    return currentUser?.id;
  }

}
