import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';  // Importa CommonModule
import { FormsModule } from '@angular/forms'; 

@Component({
  selector: 'app-departmental-manager-check-files',
  standalone: true,
  imports: [CommonModule, FormsModule ],
  templateUrl: './departmental-manager-check-files.component.html',
  styleUrl: './departmental-manager-check-files.component.css'
})
export class DepartmentalManagerCheckFilesComponent {
  
  @Input() data: any;

  constructor(private modal: NgbActiveModal){}

  closeModal(result : string ) {
    this.modal.close('result');
  }

}
