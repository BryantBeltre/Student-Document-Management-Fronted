import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { StudentFileService } from '../../service/student-file.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalPagoComponent } from '../../components/modal-pago/modal-pago.component';
import { ReactiveFormsModule } from '@angular/forms';  // Importar ReactiveFormsModule
import { DocumentStudentModalComponent } from '../../components/document-student-modal/document-student-modal.component';
import { UpdateFileStudentComponent } from '../../components/update-file-student/update-file-student.component';
import { NavbarRefreshService } from '../../service/navbar-refresh.service';


@Component({
  selector: 'app-request',
  standalone: true,
  imports: [NavbarComponent, CommonModule, ReactiveFormsModule],
  templateUrl: './request.component.html',
  styleUrl: './request.component.css'
})
export class RequestComponent {
  data: any[] = [];  // Aquí almacenaremos la data obtenida de la API
  completedServices: any[] = []; 
  errorMessage: string = '';
  showCompleted = false;

  constructor(private stdentfileS: StudentFileService, public modalService: NgbModal, private navbarService : NavbarRefreshService) { }

  ngOnInit(): void {
    // Llamar el método cuando el componente se inicializa
    this.getStatusByStudent();
  }

  getStatusByStudent() {
    this.stdentfileS.getStatusByStudentId().subscribe({
      next: (response) => {
        // Suponiendo que la API devuelve un array de servicios en la propiedad `data`
        // Filtra para excluir aquellas que no son Completadas
        
        this.data = response.data.filter((service: any) => service.status !== "Completada");
        
        // Guarda las completadas en una propiedad separada
        this.completedServices = response.data.filter((service: any) => service.status === "Completada");
        
        console.log('Datos del estudiante filtrados:', this.data);
      },
      error: (error) => {
        console.error('Error al obtener los datos del estudiante', error);
        this.errorMessage = 'Hubo un error al cargar los datos.';
      }
    });
  }

  
  openPaymentModal(data: any) {
    const modalRef = this.modalService.open(ModalPagoComponent, {
      size: 'md',
      backdrop: 'static',
      keyboard: false
    });
  
    modalRef.componentInstance.data = data;
  
    modalRef.result.then(
      (result) => {
        if (result === 'PagoCompletado') {
          // Si el pago se completó, refresca la data llamando nuevamente al método
          this.getStatusByStudent();  // Aquí actualizamos la lista de servicios
          this.navbarService.triggerNavbarRefresh();
        }
      },
      (reason) => {
        console.log('Modal cerrado sin acción', reason);
      }
    );
  }
  toggleCompleted() {
    this.showCompleted = !this.showCompleted;
  }

  getStatusText(status: string): string {
    console.log(status);
    switch (status) {
      
      case 'Nueva':
        return 'En proceso';
      case 'Devuelta':
        return 'Devuelta';
      case 'Corregida':
        return 'En proceso / corregida';
      case 'Validada':
        return 'Validada';
      case 'Pagada':
        return 'Pagada';
      case 'Completada':
        return 'Completada';
      default:
        return 'Estado desconocido';
    }

  }

  UpdatedFile(data: any) {
    const modalRef = this.modalService.open(UpdateFileStudentComponent, {
      size: 'xl',
      backdrop: 'static',
      keyboard: false
    });

    modalRef.componentInstance.data = data;

    modalRef.result.then(
      (result) => {
        if (result === 'ArchivosGuardados') {
          // Si el pago se completó, refresca la data llamando nuevamente al método
          this.getStatusByStudent();  // Aquí actualizamos la lista de servicios
        }
      },
      (reason) => {
        console.log('Modal cerrado sin acción', reason);
      }
    );
  }

}
