// pacakges
import { Routes } from '@angular/router';

// route components
import { Login } from './routes/login/login';
import { Register } from './routes/register/register';

export const routes: Routes = [
  { path: '', component: Login },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: '**', redirectTo: '' },
];
