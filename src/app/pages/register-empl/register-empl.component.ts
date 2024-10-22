import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; // Import CommonModule here
import { RegisterService } from '../../service/register.service';
import { HttpClientModule } from '@angular/common/http'; // Import HttpClientModule
import { Router } from '@angular/router';
import { MantEmplService } from '../../service/mant-empl.service';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';

import Swal from 'sweetalert2';
import { UserAdminEntity } from '../../class/user-admin-entity';
@Component({
  selector: 'app-register-empl',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, HttpClientModule, NgxMaskDirective, NgxMaskPipe],
  templateUrl: './register-empl.component.html',
  styleUrl: './register-empl.component.css',
  providers: [provideNgxMask()]
})
export class RegisterEmplComponent {
  registerForm: FormGroup;
  errorMessage: string = ""; // Variable to store error message
  isSubmitting: boolean = false;

  constructor(private fb: FormBuilder, private mantServiceEmp: MantEmplService, private route: Router) {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      identityCard: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      profileImage: ['', Validators.required],
      username: ['', Validators.required],
      rol: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8), this.passwordValidator]],
      confirmPassword: ['', Validators.required]
    }, { validator: this.passwordsMatchValidator });
  }

  // Validador personalizado para la contraseña
  passwordValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const value = control.value;
    if (!/[A-Z]/.test(value) || !/\d/.test(value)) {
      return { 'passwordInvalid': true };
    }
    return null;
  }

  // Validador personalizado para verificar si las contraseñas coinciden
  passwordsMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    if (password !== confirmPassword) {
      return { 'passwordsMismatch': true };
    }
    return null;
  }
  selectRequiredValidator(control: AbstractControl): ValidationErrors | null {
    const selectedValue = control.value;
    if (selectedValue === '' || selectedValue === 'Open this select menu') { // Check for both empty and default value
      return { required: true };
    }
    return null;
  }

  onSubmit() {
    this.isSubmitting = true; 

    if (this.registerForm.valid) {
      const formData: FormData = new FormData();

      const identityCardWithoutDashes = this.registerForm.value.identityCard.replace(/-/g, ''); // Elimina los guiones
      const phoneNumberWithoutDashes = this.registerForm.value.phone.replace(/-/g, ''); // Elimina los guiones

      formData.append('identityCard', identityCardWithoutDashes.trim());
      formData.append('firstName', this.registerForm.value.firstName.trim());
      formData.append('lastName', this.registerForm.value.lastName.trim());
      formData.append('email', this.registerForm.value.email);
      formData.append('userName', this.registerForm.value.username);
      formData.append('password', this.registerForm.value.password);
      formData.append('phoneNumber', phoneNumberWithoutDashes);
      formData.append('rol', this.registerForm.value.rol); // Convertir a cadena si es necesario

      if (this.selectedFile) {
        formData.append('profilePicture', this.selectedFile);
      } else {
        formData.append('profilePicture', '');
      }

      this.mantServiceEmp.saveUser(formData)
        .subscribe({
          next: (registerUser) => {
            console.log('User registered successfully:', registerUser);
            Swal.fire({
              title: '¡Registro exitoso!',
              text: 'El empleado ha sido registrado correctamente.',
              icon: 'success',
              confirmButtonColor: '#3085d6',
              confirmButtonText: 'Aceptar'
            });
            this.route.navigate(['/employees']);
          },
          error: (error) => {
            this.errorMessage = error; // Set a user-friendly error message
            Swal.fire({
              title: 'Ups!',
              text: `Ha ocurrido un error durante al registrar: La cédula y el correo son campos que no pueden haber existido antes . Inténtalo nuevamente.`,
              icon: 'warning',
              confirmButtonColor: '#d33',
              confirmButtonText: 'Cerrar'
            });
            this.isSubmitting = false; 

          }
        });
    } else {
      console.log('Form is invalid');
      // Mostrar errores o manejar la validación
    }
  }

  selectedFile: File | null = null;

  onFileSelected(event: any): void {
    const file: File = event.target.files[0]; // Obtén el archivo seleccionado
    if (file) {
      this.selectedFile = file;
    }
  }

  gotToForm(){
    this.route.navigate(['/adminhome']);
  }

}
