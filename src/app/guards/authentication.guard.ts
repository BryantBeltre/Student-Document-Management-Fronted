import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AuthService } from '../service/auth.service';
import { RegisterService } from '../service/register.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router,
    private registService: RegisterService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    // Verificar si el usuario está autenticado
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return false;
    }
  
    // Obtener los roles permitidos desde la configuración de la ruta
    const allowedRoles = route.data['roles'];
  
    console.log('allowedRoles:', allowedRoles);
  
    // Llamar al servicio para obtener la información del usuario por ID
    return this.registService.getUserById().pipe(
      map((user: any) => {
        // Ya no necesitas acceder a 'response.data', el rol está directamente en 'user'
        const userRole = user.data.rol; // Obtén el rol directamente del usuario
        console.log('Rol del usuario:', userRole);
    
        if (allowedRoles.includes(userRole)) {
          return true;  // Permite el acceso si el rol coincide
        } else {
          this.router.navigate(['/unauthorized']);  // Redirige si el rol no coincide
          return false;
        }
      }),
      catchError(error => {
        // Manejo de errores si la llamada al servicio falla
        console.error('Error al obtener el rol del usuario:', error);
        this.router.navigate(['/unauthorized']);
        return [false]; // Devuelve un array con 'false' para manejar el error adecuadamente
      })
    );
  }
}