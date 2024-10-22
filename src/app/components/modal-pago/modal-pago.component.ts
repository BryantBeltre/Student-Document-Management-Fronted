import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { jsPDF } from 'jspdf';  // Importar jsPDF
import { GetAllServiceService } from '../../service/get-all-service.service';
import { StudentFileService } from '../../service/student-file.service';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';



@Component({
  selector: 'app-modal-pago',
  standalone: true,
  imports: [ReactiveFormsModule, NgxMaskPipe, NgxMaskDirective],
  templateUrl: './modal-pago.component.html',
  styleUrl: './modal-pago.component.css',
  providers: [provideNgxMask()]
})
export class ModalPagoComponent {
  paymentForm: FormGroup;
  @Input() data: any;
  dataService: any;


  constructor(private fb: FormBuilder, public activeModal: NgbActiveModal, private service: GetAllServiceService, private servicesPay: StudentFileService) {
    // Inicializa el formulario de pago
    this.paymentForm = this.fb.group({
      cardNumber: ['', [Validators.required, Validators.pattern(/^\d{16}$/)]],
      cardName: ['', Validators.required],
      expiryDate: ['', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/)]],
      cvv: ['', [Validators.required, Validators.pattern(/^\d{3}$/)]]
    });
  }

  getServiceData(): void {
    this.service.getServiceById(this.data.serviceId).subscribe(
      (service) => {
        if (service) {
          this.dataService = service;
          console.log('Service Details:', this.dataService);
        } else {
          console.log('Service not found');
        }
      },
      (error) => {
        console.error('Error fetching service:', error);
      }
    );
  }



  ngOnInit(): void { console.log(this.data); this.getServiceData() }

  closeModal(result: string) {
    this.activeModal.close(result);
  }


  // Simular el proceso de pago
  processPayment() {
    if (this.paymentForm.valid) {
      this.payApplication(this.data.id);
    }
  }

  payApplication(id: any) {
    this.servicesPay.payApplicationRequest(id).subscribe({
      next: (response) => {
        // Aquí, cuando el pago se complete, cerramos el modal y refrescamos los datos en el padre
        console.log('Solicitud de pago completada con éxito');
        this.showAlert('success', 'Pago realizado con éxito');

        // Cierra el modal y pasa el resultado 'PagoCompletado'
        this.closeModal('PagoCompletado');

        // Genera el PDF (esto es opcional, ya está en tu código)
        this.generatePDF();
      },
      error: (error) => {
        console.error('Error al realizar el pago');
        this.showAlert('warning', 'Algo salió mal, revise su método de pago');
      }
    });
  }


  // Generar PDF y abrir en el visor de impresión
  generatePDF() {
    const doc = new jsPDF('p', 'mm', 'a4'); // Configuración de tamaño A4
  
    // URL de la imagen directamente
    const imageUrl = 'assets/Img/LOGO-UASD.jpg'; // Asegúrate de que la ruta sea correcta
  
    // Crear un nuevo objeto Image
    const img = new Image();
    img.src = imageUrl;
  
    img.onload = () => {
      // Agregar la imagen en la parte superior, centrada y más grande
      doc.addImage(img, 'JPEG', 50, 10, 110, 50); // Ajusta las dimensiones para hacerlo más grande y centrado
  
      // Establecer estilos para el texto
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
  
      // Título
      doc.text('Factura de Pago', 105, 70, { align: 'center' });  // Cambia la posición vertical (y) para que esté debajo de la imagen
  
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
  
      // Detalles del cliente y pago
      doc.text('Servicio Universidad Autonoma de Santo Domingo (UASD)', 20, 80);
      doc.text('Nombre en la tarjeta: ' + this.paymentForm.get('cardName')?.value, 20, 90);
      doc.text('Número de tarjeta: **** **** **** ' + this.paymentForm.get('cardNumber')?.value.slice(-4), 20, 100);
      doc.text('Fecha de Expiración: ' + this.paymentForm.get('expiryDate')?.value, 20, 110);
      doc.text('CVV: ***', 20, 120);
  
      // Añadir otros detalles de la factura
      doc.text('Nombre del servicio: ' + this.dataService.name, 20, 140);  // Ajusta la posición vertical
      doc.text('Precio: $' + this.dataService.price.toFixed(2) + ' $RD', 20, 150);  // Ajusta la posición vertical
      doc.text('Fecha de emisión: ' + new Date().toLocaleDateString(), 20, 160);  // Ajusta la posición vertical
  
      // Línea de firma
      doc.line(20, 180, 190, 180);  // Ajusta la posición vertical de la línea
      doc.text('Firma del estudiante', 105, 190, { align: 'center' });
  
      // Convertir el PDF a Blob
      const pdfBlob = doc.output('blob');
  
      // Crear una URL del Blob
      const blobUrl = URL.createObjectURL(pdfBlob);
  
      // Abrir el PDF en una nueva pestaña del navegador
      window.open(blobUrl);
    };
  
    img.onerror = (err) => {
      console.error('Error al cargar la imagen:', err);
    };
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