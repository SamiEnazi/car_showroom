import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { DashboardComponent } from './user/dashboard/dashboard.component';
import { CarDetailsComponent } from './components/car/car-details/car-details.component';
import { CarEditComponent } from './components/car/car-edit/car-edit.component';
import { ShowroomCarsComponent } from './components/showroom/showroom-cars/showroom-cars.component';
import { ShowroomComponent } from './components/showroom/showroom.component';
import { CarComponent } from './components/car/car.component';
import { ShowroomDetailsComponent } from './components/showroom/showroom-details/showroom-details.component';
import { adminAuthGuard } from './admin-auth.guard';


export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    {
        path: 'cars',
        component: CarComponent,
        canActivate: [adminAuthGuard]
    },
    { path: 'cars/:id', component: CarDetailsComponent },
    {
        path: 'cars/:id/edit', component: CarEditComponent,
        canActivate: [adminAuthGuard]
    },
    { path: 'showrooms/:id/cars', component: ShowroomCarsComponent },
    { path: 'showrooms/:id', component: ShowroomDetailsComponent },
    { path: 'showrooms', component: ShowroomComponent },
    { path: 'dashboard', component: DashboardComponent },
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    { path: '**', redirectTo: '/login' }
];