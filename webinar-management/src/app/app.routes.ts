import { Routes } from '@angular/router';
import { WebinarCreateComponent } from './components/webinar-create/webinar-create.component';

export const routes: Routes = [
  { path: '', redirectTo: 'create-webinar', pathMatch: 'full' },
  { path: 'create-webinar', component: WebinarCreateComponent }
];
