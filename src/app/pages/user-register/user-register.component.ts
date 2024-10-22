import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; // Import CommonModule here
import { RegisterService } from '../../service/register.service';
import { UserEntity } from '../../class/user-entity';
import { HttpClientModule } from '@angular/common/http'; // Import HttpClientModule
import { Router } from '@angular/router';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import Swal from 'sweetalert2';




@Component({
  selector: 'app-user-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, HttpClientModule, NgxMaskDirective, NgxMaskPipe],
  templateUrl: './user-register.component.html',
  styleUrl: './user-register.component.css',
  providers: [provideNgxMask()]
})
export class UserRegisterComponent {
  registerForm: FormGroup;
  errorMessage: string = ""; // Variable to store error message
  isSubmitting: boolean = false;

  constructor(private fb: FormBuilder, private RegisterService: RegisterService, private route: Router) {
    this.registerForm = this.fb.group({
      studentId: ['', Validators.required],  // Nuevo campo agregado
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      identityCard: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      profileImage: ['', Validators.required],
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

  /*   SweetAlert(title:string, text:string, icon:string){
      Swal.fire({
        title: title,
        text: text,
        icon: icon,
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Aceptar'
      });
    } */

  onSubmit() {
    this.isSubmitting = true;
    if (this.registerForm.valid) {
      const formData: FormData = new FormData();
      // Eliminar los guiones del campo 'identityCard' antes de enviarlo
      const identityCardWithoutDashes = this.registerForm.value.identityCard.replace(/-/g, ''); // Elimina los guiones
      const phoneNumberWithoutDashes = this.registerForm.value.phone.replace(/-/g, ''); // Elimina los guiones

      console.log(identityCardWithoutDashes, phoneNumberWithoutDashes)

      formData.append('studentId', this.registerForm.value.studentId.trim());  // Enviar studentId
      formData.append('identityCard', identityCardWithoutDashes.trim());
      formData.append('firstName', this.registerForm.value.firstName.trim());
      formData.append('lastName', this.registerForm.value.lastName.trim());
      formData.append('email', this.registerForm.value.email);
      formData.append('password', this.registerForm.value.password);
      formData.append('phoneNumber', phoneNumberWithoutDashes);
      formData.append('rol', '1'); // Assuming role 1 by default

      // Adjuntar la imagen de perfil si fue seleccionada
      if (this.selectedFile) {
        formData.append('profilePicture', this.selectedFile);
      } else {
        formData.append('profilePicture', '');
      }

      console.log(formData);

      this.RegisterService.registerStudent(formData)
        .subscribe(registeredStudent => {
          console.log('Student registered successfully:', registeredStudent);
          Swal.fire({
            title: '¡Registro exitoso!',
            text: 'El estudiante ha sido registrado correctamente.',
            icon: 'success',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'Aceptar'
          });
          this.route.navigate(['/login']);
        },
          error => {
            this.errorMessage = error.message || 'An error occurred during registration.';
            Swal.fire({
              title: '¡Error!',
              text: 'Ha ocurrido un error durante el registro: la matricula, correo y cédula son campos que no deben haber existido antes. Inténtalo nuevamente.',
              icon: 'error',
              confirmButtonColor: '#d33',
              confirmButtonText: 'Cerrar'
            });
            this.isSubmitting = false;
          });
    } else {
      console.log('Form is invalid');
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
    this.route.navigate(['/login']);
  }
}
