import { Component, ElementRef, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Role } from '../../models/Role';
import { UserService } from '../user.service';
import { Worker } from '../../models/Worker'

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css']
})
export class CreateUserComponent implements OnInit {

  isCollapsed = true

  constructor(private userService: UserService) { }

  ngOnInit(): void {
  }

  onCreateUser(createUserForm: NgForm) {
    const { name, email, password } = createUserForm.value
    //console.log(`name: ${name}, email: ${email}, password: ${password}`)
    this.userService.create({
      displayName: name,
      email: email,
      password: password,
      role: Role.User,
      userData: new Worker(name)
    }).subscribe(
      response => {
        console.log(response)
      }
    )
  }

  getUser(uid: string) {
    this.userService.user$(uid).subscribe(
      result => {
        console.log(result)
      }
    )
  }
}
