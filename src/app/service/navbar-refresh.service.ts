import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class NavbarRefreshService {

  constructor() { }

  private refreshNavbarSubject = new BehaviorSubject<boolean>(false);

  // Observable que otros componentes pueden suscribirse
  refreshNavbar$ = this.refreshNavbarSubject.asObservable();

  // Método para emitir el evento de refresco
  triggerNavbarRefresh() {
    this.refreshNavbarSubject.next(true);
  }
  
}
