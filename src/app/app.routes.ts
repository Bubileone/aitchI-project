import { Routes } from '@angular/router';
import { Dashboard } from './pages/dashboard/dashboard';
import { Locations } from './pages/locations/locations';
import { Items } from './pages/items/items';
import { Movements } from './pages/movements/movements';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: Dashboard },
  { path: 'locations', component: Locations },
  { path: 'items', component: Items },
  { path: 'movements', component: Movements },
];
