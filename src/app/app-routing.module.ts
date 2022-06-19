import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { DayworksComponent } from './dayworks/dayworks.component';
import { WorkerDetailComponent } from './workers/worker-detail/worker-detail.component';
import { WorkersComponent } from './workers/workers.component';

const routes: Routes = [
  { path: 'dayworks', component: DayworksComponent },
  { path: 'workers', component: WorkersComponent },
  { path: 'auth', component: AuthComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
