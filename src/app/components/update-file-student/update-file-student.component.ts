import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentFileService } from '../../service/student-file.service';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-update-file-student',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './update-file-student.component.html',
  styleUrl: './update-file-student.component.css'
})
export class UpdateFileStudentComponent {
  @Input() data: any;
  filesToUpdate: { [key: string]: { studentFileId: string, file: File} } = {};  // Archivos a actualizar con `studentFileId` y `file`
  

  constructor(public activeModal: NgbActiveModal, private studentFile: StudentFileService) { }

  ngOnInit() {
    console.log('mi data: ', this.data)
    if (this.data && this.data.files && Array.isArray(this.data.files)) {
      // Filtrar archivos con el status 'Devuelto'
      const returnedFiles = this.data.files.filter((file: any) => file.status === 'Devuelto');

      // Inicializar los archivos a actualizar

      returnedFiles.forEach((file: any) => {
        let fileType = file.fileType;

        // Asegurarse de que fileType sea un string
        if (typeof fileType === 'string') {
          // Eliminar todos los espacios y caracteres invisibles
          fileType = fileType.replace(/[\u200B-\u200D\uFEFF\s]/g, '').trim();
        } else {
          console.error('fileType no es una cadena válida:', fileType);
          return;
        }

        // Asignar el valor limpio como clave en el objeto filesToUpdate
        this.filesToUpdate[fileType] = {
          studentFileId: file.studentFileId,
          file: file.file  // Inicia como null hasta que se suba un nuevo archivo
        };

      });

      console.log('files to update', this.filesToUpdate);
    } else {
      console.error('La propiedad files no está presente o no es un array.');
    }
  }

  // Verifica si debe mostrarse un campo en el formulario
  shouldShowField(fileType: string): boolean {
    console.log(fileType);
    return this.filesToUpdate.hasOwnProperty(fileType);
  }

  // Maneja el cambio de archivo para un campo específico
  onFileChange(event: any, fileType: string) {
    const file = event.target.files[0];
    if (file && this.filesToUpdate[fileType]) {
      // Actualiza el archivo a subir
      this.filesToUpdate[fileType].file = file;

      console.log('bo bo bo', this.filesToUpdate);
    }
  }

  // Envía los archivos modificados al servidor para su actualización
  onSubmit() {
    let filesProcessed = 0;

    // Mapeo de tipos de documentos a índices
    const documentTypeMap: { [key: string]: number } = {
      'FotocopiaTituloMaestria': 0,
      'ActaNacimiento': 1,
      'CopiaCedula': 2,
      'DocumentoLegalizadoGrado': 3
    };

    // Procesar los archivos a actualizar
    for (const [fileType, fileInfo] of Object.entries(this.filesToUpdate)) {
      console.log('info', fileType, fileInfo);

      if (fileInfo.studentFileId) {  // Solo si hay un archivo nuevo para reemplazar y un ID válido
        const formData = new FormData();

        // Convertir fileType en número usando el documentTypeMap
        formData.append('file', fileInfo.file);
        formData.append('fileType', documentTypeMap[fileType].toString());  // Enviar el índice del tipo de documento
          // Enviar el ID del archivo

        console.log('My form data', formData);
        // Enviar archivo actualizado usando el servicio updateFile
        this.studentFile.updateFile(fileInfo.studentFileId, formData).subscribe(
          response => this.handleResponse(++filesProcessed),
          error => this.handleError(++filesProcessed)
        );
      }
    }
  }

  // Manejar la respuesta exitosa del servidor
  handleResponse(filesProcessed: number) {
    if (filesProcessed === Object.keys(this.filesToUpdate).length) {
      this.showAlert('success', 'Archivos actualizados con éxito.');
      this.closeModal('ArchivosGuardados');
    }
  }

  // Manejar los errores en la actualización
  handleError(filesProcessed: number) {
    console.error('Error al actualizar los archivos.');
    this.showAlert('warning', 'Error al actualizar los archivos.');
  }

  // Cierra el modal
  closeModal(result: string) {
    this.activeModal.close(result);
  }

  // Mostrar alertas con SweetAlert
  showAlert(icon: 'success' | 'error' | 'warning' | 'info' | 'question', message: string) {
    Swal.fire({
      icon: icon,
      title: 'Atención',
      text: message,
      confirmButtonText: 'Aceptar',
      timer: 3000,
      timerProgressBar: true
    });
  }
}
