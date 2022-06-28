import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { AuthComponent } from './auth/auth.component';
import { AuthGard } from './auth/auth.gard';
import { DayworksComponent } from './dayworks/dayworks.component';
import { WorkerDetailComponent } from './workers/worker-detail/worker-detail.component';
import { WorkersComponent } from './workers/workers.component';

const routes: Routes = [
  {
    path: 'admin', component: AdminComponent, canActivate: [AuthGard],
    children: [
      { path: 'workers', component: WorkersComponent, canActivate: [AuthGard] },
      { path: 'dayworks', component: DayworksComponent, canActivate: [AuthGard] }
    ]
  },
  { path: '', redirectTo: '/dayworks', pathMatch: 'full' },
  { path: 'dayworks', component: DayworksComponent, canActivate: [AuthGard] },
  { path: 'workers', component: WorkersComponent, canActivate: [AuthGard] },
  { path: 'auth', component: AuthComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
