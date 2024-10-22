import { Component } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { GerenteDepartamentalService } from '../../service/gerente-departamental.service';
import { Request } from '../../class/interface/request';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DepartmentalManagerCheckFilesComponent } from '../../components/departmental-manager-check-files/departmental-manager-check-files.component';


import Swal from 'sweetalert2';
import Chart from 'chart.js/auto';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-gerente-departamental-home',
  standalone: true,
  imports: [NavbarComponent, CommonModule, FormsModule],
  templateUrl: './gerente-departamental-home.component.html',
  styleUrl: './gerente-departamental-home.component.css'
})
export class GerenteDepartamentalHomeComponent {
  request: (Request & { selected?: boolean })[] = [];
  solicitudes: Array<any>[] = [];
  filteredRequests: (Request & { selected?: boolean })[] = [];  // Solicitudes filtradas
  isLoading: boolean = true;
  isStatus4View: boolean = false;  // Controla la vista actual (true = status 4, false = status 5)
  chart: any;
  pieChart: any;

  constructor(private services: GerenteDepartamentalService, private modal: NgbModal) { }

  ngOnInit() {
    this.getRequests();
    this.getAllRequest();
  }
  ngAfterViewInit() {
    this.createChart();
    this.createPieChart();
  }

  getAllRequest() {
    this.services.getAllAplication().subscribe(
      (response) => {
        // Recorre la respuesta y extrae solo el status de cada elemento
        this.solicitudes = response;
        this.updateChart();
        console.log('Statuses obtenidos:', this.solicitudes); // Muestra los statuses en consola
      },
      (error) => {
        console.error('Error al obtener solicitudes:', error); // Maneja el error si ocurre
      }
    );
  }

  getRequests() {
    this.isLoading = true;
    this.services.getApplicationDepartamental(5).subscribe(
      (response: { data: Request[] }) => {
        this.request = response.data.map(request => ({ ...request, selected: false }));
        this.isLoading = false;
        // Actualiza el gráfico cuando se obtienen las solicitudes
      },
      (error: any) => {
        console.error('Error al obtener solicitudes:', error);
        this.isLoading = false;
        this.request = [];
      }
    );
  }

  createChart() {
    const ctx = document.getElementById('myChart') as HTMLCanvasElement;
    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Nuevas', 'Devueltas', 'Validadas', 'Corregidas', 'Pagadas', 'Completadas'],
        datasets: [{
          label: 'Total de Solicitudes',
          data: [0, 0, 0, 0, 0, 0], // Inicialmente en 0
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  createPieChart() {
    const ctx = document.getElementById('myPieChart') as HTMLCanvasElement;
    const totals = this.calculateTotals(); // Obtener los totales para los diferentes estados
    this.pieChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Nuevas', 'Devueltas', 'Validadas', 'Corregidas', 'Pagadas', 'Completadas'],
        datasets: [{
          label: 'Total de Solicitudes',
          data: totals,
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,  // Permite ajustar el tamaño sin mantener la relación de aspecto
        plugins: {
          legend: {
            position: 'top',
          },
          tooltip: {
            callbacks: {
              label: function (tooltipItem: any) {
                return tooltipItem.label + ': ' + tooltipItem.raw;
              }
            }
          }
        }
      }
    });
  }

  updateChart() {
    const totals = this.calculateTotals();
    this.chart.data.datasets[0].data = totals;
    this.chart.update();

    this.pieChart.data.datasets[0].data = totals;
    this.pieChart.update();
  }

  calculateTotals() {
    // Check if this.solicitudes is defined and is an array
    if (!Array.isArray(this.solicitudes)) {
      console.error('solicitudes is not an array or undefined.');
      return [0, 0, 0, 0, 0, 0];  // Return default values if it's not an array
    }

    // Use filter function only if solicitudes is confirmed to be an array
    const newCount = this.solicitudes.filter((r: any) => r.status === 'Nueva').length;
    console.log(newCount, 'cuenta');
    const returnedCount = this.solicitudes.filter((r: any) => r.status === 'Devuelta').length;
    const validatedCount = this.solicitudes.filter((r: any) => r.status === 'Validada').length;
    const correctedCount = this.solicitudes.filter((r: any) => r.status === 'Corregida').length;
    const paidCount = this.solicitudes.filter((r: any) => r.status === 'Pagada').length;
    const completedCount = this.solicitudes.filter((r: any) => r.status === 'Completada').length;

    return [newCount, returnedCount, validatedCount, correctedCount, paidCount, completedCount];
  }


  toggleAllSelections(event: any) {
    const isChecked = event.target.checked;

    // Contar cuántas filas ya están seleccionadas
    const currentlySelected = this.filteredRequests.filter(re => re.selected).length;

    // Si se seleccionan todas y el número total excede el límite de 5, limitar la selección
    if (isChecked && this.filteredRequests.length > 5) {
      this.filteredRequests.forEach((re, index) => {
        re.selected = index < 5; // Solo seleccionar las primeras 5 filas
      });
      this.showAlert('warning', 'Solo puedes seleccionar hasta 5 filas.');
    } else {
      this.filteredRequests.forEach(re => re.selected = isChecked);
    }
  }

  sendSelectedIds() {
    const selectedRequests = this.filteredRequests
      .filter(re => re.selected)  // Filtrar los seleccionados
      .map(re => re.id);  // Extraer los IDs

    if (selectedRequests.length === 0) {
      this.showAlert('warning', '¡No has seleccionado ninguna solicitud!');
      return;
    }

    this.services.completeApplicationProcess(selectedRequests).subscribe(
      (response) => {
        console.log('Proceso completado con éxito:', response.data);
        this.showAlert('success', '¡Proceso completado con éxito!');
        this.showNumberOficce('info', response.data);

        // Aquí puedes recargar o actualizar la tabla
      },
      (error) => {
        console.error('Error al completar el proceso:', error);
        this.showAlert('warning', '¡Error al completar el proceso!');
      }
    );
  }

  // Método para mostrar alertas
  showAlert(icon: 'success' | 'error' | 'warning' | 'info' | 'question', message: string) {
    Swal.fire({
      icon: icon,
      title: 'Atención',
      text: message,
      confirmButtonText: 'Aceptar',
      timer: 3000,  // Opción para cerrar automáticamente después de 3 segundos
      timerProgressBar: true
    });

    this.getRequests();
  }


  showNumberOficce(icon: 'success' | 'error' | 'warning' | 'info' | 'question', message: string) {
    Swal.fire({
      icon: icon,
      title: 'El número de oficio del grupo completado es :',
      text: message,
      confirmButtonText: 'Aceptar',
      //timer: 3000,  // Opción para cerrar automáticamente después de 3 segundos
      timerProgressBar: true
    });

    this.getRequests();
  }

  // Método para abrir el modal
  modalReception(data: any) {
    const modalRef = this.modal.open(DepartmentalManagerCheckFilesComponent, {
      size: 'xl',  // tamaño del modal, puede ser 'lg' o 'md' dependiendo de tus necesidades
      backdrop: 'static',  // No permite cerrar el modal haciendo clic afuera
      keyboard: false  // Evita que se cierre con la tecla ESC
    });

    modalRef.componentInstance.data = data;

    modalRef.result.then(
      (result) => {
        console.log(result); // Aquí puedes manejar el resultado del modal (ej. "Pago completado")
        if (result === 'Exito') {
          this.isLoading = true;
        }
      },
      (reason) => {
        console.log('Modal cerrado sin completar la acción');
      }
    );
  }

  // Método para filtrar solicitudes por status 4


  filterByStatus(status: number) {
    this.isLoading = true;

    // Limpiar todas las selecciones antes de filtrar
    this.request.forEach(re => re.selected = false);
    this.filteredRequests = [];

    this.services.getApplicationDepartamental(status).subscribe(
      (response: { data: Request[] }) => {
        this.request = response.data.map(request => ({ ...request, selected: false }));
        this.filteredRequests = this.request;  // Actualizar la lista filtrada
        this.isLoading = false;

        // Actualizar el estado de la vista
        if (status === 4) {
          this.isStatus4View = true;
        } else {
          this.isStatus4View = false;
        }
      },
      (error: any) => {
        console.error('Error al obtener solicitudes:', error);
        this.isLoading = false;
        this.request = [];
        this.isStatus4View = false;
      }
    );
  }

  onRowSelectionChange(re: Request & { selected?: boolean }) {
    // Contar cuántas filas están seleccionadas
    const selectedCount = this.filteredRequests.filter(re => re.selected).length;

    // Si hay más de 5 seleccionadas, revertir la selección
    if (selectedCount > 5) {
      re.selected = false;  // Revertir la selección de la fila actual
      this.showAlert('warning', 'No puedes seleccionar más de 5 filas.');
    }
  }
}