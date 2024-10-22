import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faUser, faLock } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../../service/auth.service';
import { RegisterService } from '../../service/register.service';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';  // Importa HttpClientModule
import { CommonModule } from '@angular/common';  // Importa CommonModule para usar ngIf y otras directivas
import { response } from 'express';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-component-login',
  standalone: true,
  providers: [AuthService],
  imports: [FormsModule, ReactiveFormsModule, FontAwesomeModule, HttpClientModule, CommonModule],
  templateUrl: './component-login.component.html',
  styleUrls: ['./component-login.component.css']
})
export class ComponentLoginComponent {
  loginForm: FormGroup;
  loading = false;
  errorMessage = '';
  successMessage = '';

  faUser = faUser;
  faLock = faLock;

  constructor(
    private authService: AuthService,
    private router: Router,
    private formBuilder: FormBuilder,
    private registService : RegisterService
  ) {
    this.loginForm = this.formBuilder.group({
      userName: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  navigateByUserRole(userRole: string) {
    switch (userRole) {
      case 'Student':
        this.router.navigate(['/home']);
        break;
      case 'Admin':
        this.router.navigate(['/adminhome']);
        break;
      case 'Reception':
        this.router.navigate(['/reception']);
        break;
      case 'DepartmentalManager':
        this.router.navigate(['/departmentalmanager']);
        break;
      default:
        console.error('Rol no reconocido');
    }
  }


  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
  
    const userName = this.loginForm.controls['userName'].value.trim();
    const password = this.loginForm.controls['password'].value.trim();
  
    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';
  
    this.authService.login(userName, password)
      .subscribe(
        data => {
          if (data.success) {
            this.successMessage = '¡Inicio de sesión exitoso!';
  
            // Obtener el rol del usuario después del login
            this.registService.getUserById().subscribe(
              (response: any) => {
                const userRole = response.data.rol;
                // Redirigir según el rol del usuario
                this.navigateByUserRole(userRole);
              },
              error => {
                this.showAlert('warning', 'Error al obtener la información del usuario. Inténtalo más tarde.');
                this.errorMessage = 'Error al obtener la información del usuario. Inténtalo más tarde.';
              }
            );
          } else {
            this.errorMessage = 'Credenciales Incorrectas. Inténtalo de nuevo.';
            this.showAlert('warning', 'Credenciales Incorrectas. Inténtalo de nuevo.');
          }
          this.loading = false;
        },
        error => {
          // Mostrar el mensaje de error directamente del servidor
          this.showAlert('warning', error.message);
          this.errorMessage = error.message;
          this.loading = false;
        }
      );
  }

  
  showAlert(icon: 'success' | 'error' | 'warning' | 'info' | 'question', message: string) {
    Swal.fire({
      icon: icon,
      title: 'Atención',
      text: message,
      confirmButtonText: 'Aceptar',
      timer: 3000,  // Opción para cerrar automáticamente después de 3 segundos
      timerProgressBar: true
    });
  }
}