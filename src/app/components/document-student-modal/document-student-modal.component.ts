import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentFileService } from '../../service/student-file.service';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';



@Component({
  selector: 'app-document-student-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './document-student-modal.component.html',
  styleUrl: './document-student-modal.component.css'
})
export class DocumentStudentModalComponent {

  @Input() data: any;
  files: { [key: string]: File } = {}; // Para almacenar los archivos con sus identificadores
  aviso : string = "";  
  icon_aviso : string = "";
  savedFileIds: any[] = [];
  isSubmitting: boolean = false; // Nueva variable para controlar el estado del botón


  constructor(public activeModal: NgbActiveModal, private studentFile: StudentFileService) { }

  ngOnInit() {
    console.log('Datos recibidos en el modal:', this.data);
  }

  // Manejar el cambio de archivo
  onFileChange(event: any, documentId: string) {    

    const file = event.target.files[0];
    if (file) {
      this.files[documentId] = file; // Almacenar el archivo con su ID
    }
  }

  // Manejar el envío del formulario
  onSubmit() {

    let isValid = true;
    const requiredFiles = ['documentFotoCopia', 'documentCopiaCedula'];
  
    // Si es tipo MESCYT, se requieren más documentos
    if (this.data.serviceType === 'MESCYT') {
      requiredFiles.push('documentActaNacimiento', 'documentLegalizadoDeGrado');
    }
  
    // Comprobar que todos los archivos requeridos han sido subidos
    requiredFiles.forEach(doc => {
      if (!this.files[doc]) {
        isValid = false;
        this.showAlert('warning', `El documento ${doc} es requerido.`);
      }
    });
  
    if (!isValid) {
      this.isSubmitting = false;
      return;
    }
    
    this.isSubmitting = true; // Deshabilitar el botón cuando el usuario haga clic en él 
    const documentTypeMap: { [key: string]: number } = {
      'documentFotoCopia': 0,
      'documentActaNacimiento': 1,
      'documentCopiaCedula': 2,
      'documentLegalizadoDeGrado': 3
    };

    let uploadSuccess = true;
    let filesProcessed = 0; 

    // Loop a través de los archivos y enviar cada uno con su tipo correspondiente
    for (const [documentId, file] of Object.entries(this.files)) {
      const formData = new FormData();

      // Agregar el archivo y el tipo de archivo al FormData
      formData.append('file', file);
      formData.append('fileType', documentTypeMap[documentId].toString());

      // Enviar cada archivo de forma individual
      this.studentFile.uploadFiles(formData).subscribe(
        response => {
          this.savedFileIds.push({ studentFileId: response.data });

          console.log(`Archivo ${documentId} subido exitosamente`, response);
          filesProcessed++;
          if (filesProcessed === Object.keys(this.files).length) {
            if (uploadSuccess) {
              // Todos los archivos fueron subidos exitosamente
              this.showAlert('success','Archivos guardados con éxito.');
              this.closeModal(); // Cierra el modal
              this.saveApplication();
            }
          }

        },
        error => {
          console.error(`Error al subir el archivo ${documentId}`, error);

          uploadSuccess = false; // Indica que hubo un error en la carga
          filesProcessed++;
  
          if (filesProcessed === Object.keys(this.files).length) {
            if (!uploadSuccess) {
              // Hubo un error en la subida de archivos
              this.showAlert('warning','Error subiendo los archivos.');
              this.closeModal(); // Cierra el modal incluso si hubo un error
            }
          }
          this.aviso="Error subiendo los archivos";
          this.icon_aviso = "warning";
          this.isSubmitting = false;
        }
      );
    }
  }
  // Cerrar el modal
  closeModal() {
    this.activeModal.close('Modal cerrado');
  }

  saveApplication() {
    const serviceId = this.data.id;  // Usar el serviceId pasado al modal

    console.log('Los datos del aplication: ' , serviceId, this.savedFileIds);
    // Llamar al servicio con el serviceId y el arreglo de studentFileIds
    this.studentFile.saveAplication(serviceId, this.savedFileIds).subscribe(
      (response: any) => {
        if (response.success) {
          alert('Todos los archivos han sido guardados exitosamente.');
          this.aviso = "Registros guardados con éxito";
          this.icon_aviso = "success";
          this.closeModal(); // Cerrar el modal cuando se haya completado todo
        }
      },
      (error) => {
        console.error('Error al guardar los archivos:', error);
        alert('Error al guardar los archivos.');
        this.aviso = "Error guardando los archivos";
        this.icon_aviso = "warning";
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
