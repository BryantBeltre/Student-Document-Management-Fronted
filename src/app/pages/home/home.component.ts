import { Component, ElementRef, ViewChild } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { HttpClientModule } from '@angular/common/http';
import { RegisterService } from '../../service/register.service';
import { CommonModule } from '@angular/common';  // Importar CommonModule
import { GetAllServiceService } from '../../service/get-all-service.service';
import { Router } from '@angular/router';
import { DocumentStudentModalComponent } from '../../components/document-student-modal/document-student-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NavbarComponent, HttpClientModule, CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  @ViewChild('documentStudentModal') modalElement!: ElementRef;
  services: any[] = [];
  groupedServices: any[] = [];

  constructor(private route: Router, public modalService: NgbModal, private getAllSer: GetAllServiceService) { } // Inyecta MatDialog en lugar de MatDialogModule



  openRegisterModal(data: any) {

    console.log('Datos enviados al modal:', data);  
    const modalRef = this.modalService.open(DocumentStudentModalComponent, {
      size: 'xl',  // Aquí defines que el modal será extra grande
      backdrop: 'static',  // Evita que se cierre al hacer clic fuera del modal
      keyboard: false, 
    });

    modalRef.componentInstance.data = data;
  }
  ngOnInit(): void {
    // Aquí puedes cargar los datos o ejecutar alguna lógica al inicio.
    this.getAllServices();
  }

  getAllServices() {
    this.getAllSer.getAllService().subscribe(
      (data) => {
        this.services = data;
        console.log('Mi data es: ', data)
        this.groupServicesByName();
      },
      (error) => {
        console.error('Error al obtener los servicios:', error);
      }
    );
  }

  groupServicesByName(){
    const serviceMap = new Map();

    this.services.forEach(service => {
      if(!serviceMap.has(service.name)){
        serviceMap.set(service.name, []);        
      }
      serviceMap.get(service.name).push(service);
    });
    
    this.groupedServices = Array.from(serviceMap, ([name, services]) => ({name, services}));
  }

  GetDocumentMecyt() {

  }
}