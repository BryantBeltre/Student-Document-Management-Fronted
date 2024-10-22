import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';  // Importa CommonModule
import { FormsModule } from '@angular/forms'; 
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ReceptionFilesService } from '../../service/reception-files.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-reception-check-file-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reception-check-file-modal.component.html',
  styleUrl: './reception-check-file-modal.component.css'
})
export class ReceptionCheckFileModalComponent {
  @Input() data: any;
  isLoading: boolean = false;

  constructor(public activeModal: NgbActiveModal, private receptiService : ReceptionFilesService){}

  ngOnInit(): void {
    console.log('Solicitud:', this.data);
  }

  openPdf(url: string): void {
    window.open(url, '_blank');
  }

  updateFileStatuses(): void {
    this.isLoading = true;  // Deshabilitamos el botón al comenzar el proceso
  
    // Mapeo de estados en texto a los valores numéricos que espera la API
    const statusMap: { [key: string]: number } = {
      'Nuevo': 0,
      'Devuelto': 1,
      'Corregido': 2,
      'Validado': 3
    };
  
    let hasError = false;  // Para rastrear si hay errores
  
    // Recorrer todos los archivos en el data
    this.data.files.forEach((file: any) => {
      const idFile = file.studentFileId;
      const statusText = file.status;  // El estado en texto (Ej. "Nuevo", "Devuelto", etc.)
  
      // Convertir el estado en texto al número correspondiente
      const status = statusMap[statusText] !== undefined ? statusMap[statusText] : 0;
  
      // Llamar al servicio para cambiar el estado de cada archivo
      this.receptiService.changeStatus(idFile, status).subscribe({
        next: (response) => {
          console.log(`Archivo ${idFile} actualizado con éxito.`);
        },
        error: (err) => {
          hasError = true;
          console.error(`Error al actualizar el archivo ${idFile}:`, err);
          this.showAlert('error', `Error al actualizar el archivo ${file.fileType}.`);
        },
        complete: () => {
          // Si no hubo errores en ninguna actualización
          if (!hasError) {
            this.showAlert('success', 'Todos los archivos se actualizaron correctamente.');
            this.closeModal('Exito');
          } else {
            this.showAlert('error', 'Hubo un problema actualizando algunos archivos.');
          }
          this.isLoading = false;  // Termina la actualización, habilitamos el botón
        }
      });
    });
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

  closeModal(result : string ) {
    this.activeModal.close(result);
  }

}
