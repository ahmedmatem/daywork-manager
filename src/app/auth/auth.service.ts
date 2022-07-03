import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, catchError, never, Observable, tap, throwError } from "rxjs";
import { SIGN_IN_ENDPOINT } from "../app.config";
import { User } from "./user.model";

interface AuthResponseData {
  idToken: string,
  email: string,
  refreshToken: string,
  expiresIn: string,
  localid: string,
  registered: boolean
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  user = new BehaviorSubject<User | null>(null)
  private tokenExpirationTimer: any

  constructor(private http: HttpClient,
    private router: Router) { }

  login(email: string, password: string) {
    const url = SIGN_IN_ENDPOINT
    const body = {
      email: email,
      password: password,
      returnSecureToken: true
    }
    return this.http.post<AuthResponseData>(url, body).pipe(
        tap(resData => {
          this.handleAuthentication(email,  resData.localid, resData.idToken, +resData.expiresIn)
        }),
        catchError(errResponse => {
          return this.handleError(errResponse)
        }))
  }

  autoLogin() {
    const userData: string | null = localStorage.getItem('userData')
    if (!userData) return

    const user: {
      email: string,
      id: string,
      _token: string,
      _tokenExpirationDate: string,
      _role: string
    } = JSON.parse(userData)

    const loadedUser = new User(
      user.email,
      user.id,
      user._token,
      new Date(Date.parse(user._tokenExpirationDate))
    )

    if (loadedUser.token) {
      this.user.next(loadedUser)
      const expirationDuration =
        new Date(Date.parse(user._tokenExpirationDate)).getTime() - new Date().getTime()
      this.autoLogout(expirationDuration)
    }
  }

  logout() {
    this.user.next(null)
    this.router.navigate(['/auth'])
    localStorage.removeItem('userData')
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer)
      this.tokenExpirationTimer = null
    }
  }

  autoLogout(expirationDuration: number) {
    //console.log(expirationDuration)
    this.tokenExpirationTimer = setTimeout(
      () => {
        this.logout()
      },
      expirationDuration)
  }

  private handleAuthentication(
    email: string,
    userId: string,
    token: string,
    expiresIn: number
  ) {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000)
    const user = new User(email, userId, token, expirationDate)
    this.user.next(user)
    this.autoLogout(expiresIn * 1000)
    localStorage.setItem('userData', JSON.stringify(user))
  }

  private handleError(errResponse: any): Observable<any> {
    let err = new Error('An unknown error occured!')

    if (!errResponse.error || !errResponse.error.error) {
      return throwError(() => err.message)
    }

    switch (errResponse.error.error.message) {
      case 'EMAIL_NOT_FOUND':
        err.message = `Email not found.`
        break
      case 'INVALID_PASSWORD':
        err.message = `The password is invalid or the user does not have a password.`
        break
      case 'USER_DISABLED':
        err.message = `The user account has been disabled by an administrator.`
        break
      default:
        err.message = 'An unknown error occured!'
    }

    return throwError(() => err.message)
  }
}
