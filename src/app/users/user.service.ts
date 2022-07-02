import { HttpClient } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { map, Observable } from "rxjs"
import { User } from "../auth/user.model"

export type CreateUserRequest = {
  displayName: string,
  password: string,
  email: string,
  role: string
}
export type UpdateUserRequest = { uid: string } & CreateUserRequest

@Injectable({ providedIn: 'root' })
export class UserService {
  private baseUrl = 'https://us-central1-daywork-manager.cloudfunctions.net/api/users'

  constructor(private http: HttpClient) { }

  create(user: CreateUserRequest) {
    return this.http.post(this.baseUrl, user)
  }

  user$(id: string): Observable<User> {
    return this.http.get<{ user: User }>(`${this.baseUrl}/${id}`)
      .pipe(
        map((result: { user: User }) => {
          return result.user
        }))
  }
}
