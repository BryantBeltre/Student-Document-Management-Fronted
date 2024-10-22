import { Component } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { Request } from '../../class/interface/request';
import { CommonModule } from '@angular/common';
import { ReceptionFilesService } from '../../service/reception-files.service';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ReceptionCheckFileModalComponent } from '../../components/reception-check-file-modal/reception-check-file-modal.component';



@Component({
  selector: 'app-reception-home',
  standalone: true,
  imports: [NavbarComponent, CommonModule, FormsModule],
  templateUrl: './reception-home.component.html',
  styleUrl: './reception-home.component.css'
})
export class ReceptionHomeComponent {
  request: Request[] = [];  // Variable para almacenar la lista de usuarios
  isLoading = true;     
  selectedStatus: string = '';

  constructor(private serviceReception: ReceptionFilesService, public modalService: NgbModal){

  }

/*   ngOnInit(): void {
    this.serviceReception.getRequest(3).subscribe(
      (response : { data: Request[], message: string, success: boolean}) =>{
        this.request = response.data;
        console.log('puf',this.request);
        this.isLoading = false
      }
    );

  } */

  getRequest(status: string) {
    // Convertir el valor de string a número
  
    const statusAsNumber: number = parseInt(status, 10); // Base 10 para números decimales
    
    // Ahora 'statusAsNumber' es de tipo number
    console.log('Estatus seleccionado (como número):', statusAsNumber);
    this.serviceReception.getRequest(statusAsNumber).subscribe(
      (response : { data: Request[], message: string, success: boolean}) =>{
        this.request = response.data;
        console.log('puf',this.request);
        this.isLoading = false
      },
      (error : HttpErrorResponse) =>{
        this.showAlert('warning', '¡No existen registros con este estatus!');
      }
    );

    // Aquí puedes continuar con la lógica según el valor numérico
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

  modalReception(data: any){
    const modalRef = this.modalService.open(ReceptionCheckFileModalComponent, {
      size: 'xl',  // tamaño del modal, puede ser 'lg' o 'md' dependiendo de tus necesidades
      backdrop: 'static',  // No permite cerrar el modal haciendo clic afuera
      keyboard: false  // Evita que se cierre con la tecla ESC
    });

    modalRef.componentInstance.data = data;

    modalRef.result.then(
      (result) => {
        console.log(result); // Aquí puedes manejar el resultado del modal (ej. "Pago completado")
        if(result === 'Exito'){
          this.isLoading = true;
          this.getRequest('0');

        }
      },
      (reason) => {
        this.isLoading = true;
        this.request = [];
      }
    );
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
