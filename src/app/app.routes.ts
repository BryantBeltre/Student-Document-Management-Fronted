import { Routes } from '@angular/router';
import { ComponentLoginComponent } from './pages/component-login/component-login.component';
import { UserRegisterComponent } from './pages/user-register/user-register.component';
import { HomeComponent } from './pages/home/home.component';
import { AuthGuard } from './guards/authentication.guard';
import { RegisterEmplComponent } from './pages/register-empl/register-empl.component';
import { AdminHomeComponent } from './pages/admin-home/admin-home.component';
import { RequestComponent } from './pages/request/request.component';
import { ReceptionHomeComponent } from './pages/reception-home/reception-home.component';
import { GerenteDepartamentalHomeComponent } from './pages/gerente-departamental-home/gerente-departamental-home.component';
import { UnauthorizedComponent } from './components/unauthorizedComponent ';

export const routes: Routes = [
  { path: 'login', component: ComponentLoginComponent },
  { path: 'register', component: UserRegisterComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard], data: { roles: ['Student'] } },
  { path: 'employees', component: RegisterEmplComponent, canActivate: [AuthGuard], data: { roles: ['Admin'] } },
  { path: 'adminhome', component: AdminHomeComponent, canActivate: [AuthGuard], data: { roles: ['Admin'] } },
  { path: 'studentsRequest', component: RequestComponent, canActivate: [AuthGuard], data: { roles: ['Student'] } },
  { path: 'reception', component: ReceptionHomeComponent, canActivate: [AuthGuard], data: { roles: ['Reception'] } },
  { path: 'departmentalmanager', component: GerenteDepartamentalHomeComponent, canActivate: [AuthGuard], data: { roles: ['DepartmentalManager'] } },
  { path: 'unauthorized', component: UnauthorizedComponent },  // Página de acceso denegado
  { path: '**', redirectTo: 'login', pathMatch: 'full' }
];