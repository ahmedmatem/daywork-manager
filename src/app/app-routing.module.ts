import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { AuthComponent } from './auth/auth.component';
import { AuthGard } from './auth/auth.gard';
import { DayworksComponent } from './dayworks/dayworks.component';
import { Role } from './models/Role';
import { WorkerDetailComponent } from './workers/worker-detail/worker-detail.component';
import { WorkersComponent } from './workers/workers.component';

const routes: Routes = [
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AuthGard],
    data: { roles: [Role.Admin, Role.Manager] },
    children: [
      { path: 'workers', component: WorkersComponent, canActivate: [AuthGard] },
      { path: 'dayworks', component: DayworksComponent, canActivate: [AuthGard] }
    ]
  },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: DayworksComponent, canActivate: [AuthGard] },
  //{ path: 'dayworks', component: DayworksComponent, canActivate: [AuthGard] },
  { path: 'workers', component: WorkersComponent, canActivate: [AuthGard] },
  { path: 'auth', component: AuthComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
