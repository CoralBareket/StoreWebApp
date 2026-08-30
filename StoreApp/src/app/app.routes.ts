import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Products } from './pages/products/products';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    component: Login,
  },
  {
    path: 'products',
    component: Products,
    canActivate: [authGuard],
  },

  // Default route: matches only the empty URL "/" and redirects it to "/login".
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
];
