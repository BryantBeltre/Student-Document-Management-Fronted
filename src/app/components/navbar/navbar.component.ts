import { Component } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { Router } from '@angular/router';
import { RegisterService } from '../../service/register.service';
import { CommonModule } from '@angular/common';
import { StudentFileService } from '../../service/student-file.service';
import { UserEntity } from '../../class/user-entity';
import { faL } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  profilePicture: string = '';
  student :boolean = false;
  notification : boolean = false;

  constructor(private auth: AuthService, private route: Router, private stdentfileS : StudentFileService ,private register: RegisterService){
  }

  logout(){
    this.auth.logout();    
    this.route.navigate(['/login']);
  }


  ngOnInit(): void {
    this. getStatusByStudent();
    // Llama al servicio para obtener el perfil del estudiante
    this.register.getUserById().subscribe(
      (response: any) => {
        console.log('rolnav',response.data.rol);
        if(response.data.rol === 'Student'){
          this.student = true;
        }
        else{
          this.student = false;          
        }
  
        // Accede al campo 'profilePicture' dentro de 'data'
        this.profilePicture = response.data.profilePicture;
        console.log('foto',response.data);
      },
      (error) => {
        console.error('Error al obtener el perfil del usuario:', error);
      }
    );
  }

  getStatusByStudent() {
    this.stdentfileS.getStatusByStudentId().subscribe({
      next: (response) => {
        // Asegúrate de que response.data es un array antes de proceder
        if (Array.isArray(response.data)) {
          // Verifica si alguno de los objetos en el array tiene el campo 'status' con el valor 'validada'
          const hasValidatedStatus = response.data.some((item: any) => item.status === 'Validada' || item.status === 'Devuelta');

          console.log(hasValidatedStatus, 'hasval');
          
          // Si se encuentra el estado 'validada', establece this.notification en true
          if (hasValidatedStatus) {
            this.notification = true;
          } else {
            this.notification = false;
          }
        } else {
          console.error('El formato de los datos no es correcto.');
        }
      },
      error: (error) => {
        console.error('Error al obtener los datos del estudiante', error);
      }
    });
  }
  goToHome(){
    this.route.navigate(['/home']);
  }

  goRquest(){
    this.route.navigate(['/studentsRequest']);
  }

}
