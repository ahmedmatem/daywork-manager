import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DayworksComponent } from './dayworks/dayworks.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { WorkersComponent } from './workers/workers.component';
import { NgbModule, NgbTimepickerConfig, NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, NG_VALIDATORS } from '@angular/forms';
import { WorkerDetailComponent } from './workers/worker-detail/worker-detail.component';
import { CreateUserComponent } from './users/create-user/create-user.component';
import { NumberPickerComponent } from './share/number-picker/number-picker.component';
import { LoadingSpinnerComponent } from './share/loading-spinner/loading-spinner.component';
import { HeaderComponent } from './header/header.component';
import { UserHeaderComponent } from './header/user-header/user-header.component';
import { AuthComponent } from './auth/auth.component';
import { AdminComponent } from './admin/admin.component';
import { AdminHeaderComponent } from './admin/admin-header/admin-header.component';
import { WorkerDayworksComponent } from './dayworks/worker-dayworks/worker-dayworks.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthTokenHttpInterceptor } from './auth/auth-token.interceptor';
import { ForbiddenNameDirective } from './share/forbidden-name.directive';

@NgModule({
  declarations: [
    AppComponent,
    DayworksComponent,
    WorkersComponent,
    WorkerDayworksComponent,
    WorkerDetailComponent,
    CreateUserComponent,
    NumberPickerComponent,
    LoadingSpinnerComponent,
    HeaderComponent,
    UserHeaderComponent,
    AuthComponent,
    AdminComponent,
    AdminHeaderComponent,
    ForbiddenNameDirective
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatDatepickerModule,
    MatInputModule,
    MatNativeDateModule,
    MatCardModule,
    NgbModule,
    HttpClientModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthTokenHttpInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
