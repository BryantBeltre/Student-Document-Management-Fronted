import { Component, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';

import { RegisterService } from '../../service/register.service';
import { UserEntity } from '../../class/user-entity';

@Component({
  selector: 'app-admin-home',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './admin-home.component.html',
  styleUrl: './admin-home.component.css'
})
export class AdminHomeComponent {

  users: UserEntity[] = [];  // Variable para almacenar la lista de usuarios
  isLoading = true;         // Variable para manejar el estado de carga

  constructor(private userService: RegisterService, private route: Router) { }

  ngOnInit(): void {
    this.userService.getAllUsers().subscribe(
      (response: { data: UserEntity[], message: string, success: boolean }) => {
        this.users = response.data; // Extrae el array de usuarios del objeto de respuesta
        console.log(this.users);
        this.isLoading = false;  // Cambia el estado de carga cuando los datos están listos
      },
      (error) => {
        console.error('Error fetching users', error);
        this.isLoading = false;  // Cambia el estado de carga incluso si hay un error
      }
    );
  }




  navigateTo() {
    this.route.navigate(['/employees']);

  }

  searchTable() {
    const input = document.getElementById("searchInput") as HTMLInputElement;
    const filter = input.value.toUpperCase();
    const table = document.getElementById("userTable") as HTMLTableElement;
    const tr = table.getElementsByTagName("tr");
  
    for (let i = 1; i < tr.length; i++) { // Empieza desde 1 para omitir el encabezado
      let shouldShowRow = false; // Variable para saber si mostramos la fila
  
      // Obtener todas las columnas (celdas) de la fila
      const tdArray = tr[i].getElementsByTagName("td");
  
      // Iterar sobre las celdas de la fila para buscar coincidencias
      for (let j = 0; j < tdArray.length; j++) {
        const td = tdArray[j];
        if (td) {
          const txtValue = td.textContent || td.innerText;
          if (txtValue.toUpperCase().indexOf(filter) > -1) {
            shouldShowRow = true; // Hay coincidencia, marcar fila para mostrar
            break;
          }
        }
      }
  
      // Mostrar o ocultar la fila basado en el resultado de la búsqueda
      tr[i].style.display = shouldShowRow ? "" : "none";
    }
  }


}
