import { Component } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "./auth.service";

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html'
})
export class AuthComponent {
  isLoading: boolean = false
  error!: string

  constructor(private authService: AuthService, private router: Router) { }

  onSubmit(form: NgForm) {
    if (!form.valid) return

    this.isLoading = true

    const email = form.value.email
    const password = form.value.password

    this.authService.login(email, password).subscribe(
      responseData => {
        this.isLoading = false
        //console.log(responseData)
        this.router.navigate(['/dayworks'])
      },
      errorMessage => {
        this.isLoading = false
        this.error = errorMessage

      })

    //form.reset()
  }
}
