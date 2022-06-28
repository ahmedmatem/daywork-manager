import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DayworksComponent } from './dayworks/dayworks.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'

import { WorkersComponent } from './workers/workers.component';
import { NgbAccordion, NgbModule, NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { WorkerDetailComponent } from './workers/worker-detail/worker-detail.component';
import { WorkerDayworksComponent } from './dayworks/worker-dayworks/worker-dayworks.component';
import { AuthComponent } from './auth/auth.component';
import { HeaderComponent } from './header/header.component';
import { LoadingSpinnerComponent } from './share/loading-spinner/loading-spinner.component';
import { AuthInterceptorService } from './auth/auth-interceptor.service';
import { NumberPickerComponent } from './share/number-picker/number-picker.component';

@NgModule({
  declarations: [
    AppComponent,
    DayworksComponent,
    WorkersComponent,
    WorkerDetailComponent,
    WorkerDayworksComponent,
    AuthComponent,
    HeaderComponent,
    LoadingSpinnerComponent,
    NumberPickerComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    NgbModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
