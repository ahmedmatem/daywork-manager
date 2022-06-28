import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, Observable, throwError } from "rxjs";
import { AuthService } from "./auth.service";

/**
 * The Error Interceptor intercepts http responses from the api
 * to check if there were any errors. If there is a 401 Unauthorized
 * or 403 Forbidden response the user is automatically logged out
 * of the application, all other errors are re-thrown up to the
 * calling service so an alert with the error can be displayed on
 * the screen.
 * 
 * Catching all error responses from the api in a single location.
 * */
@Injectable()
export class AuthErrorinterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    next.handle(req).pipe(
      catchError(err => {
        if ([401, 403].indexOf(err.status) !== -1) {
          /**
           * Auto logout if 401 Unauthorized or
           * 403 Forbidden response returned from api
           */
          this.authService.logout()
        }

        const error = err.error.message || err.statusText
        return throwError(error)
      }))

    return next.handle(req)
  }

}
