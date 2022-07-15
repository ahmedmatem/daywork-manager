import { Component, ElementRef, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Role } from '../../models/Role';
import { UserService } from '../user.service';
import { Worker } from '../../models/Worker'
import { HttpErrorResponse } from '@angular/common/http';
import { Subject } from 'rxjs';
import { WorkerRepositoryService } from '../../data/worker-repository.service';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css']
})
export class CreateUserComponent implements OnInit {
  isUserCreated = false
  errMessage: string | null = null

  isCollapsed = true

  constructor(
    private userService: UserService,
    private workerRepoService: WorkerRepositoryService
  ) { }

  ngOnInit(): void {
  }

  onCreateUser(createUserForm: NgForm) {
    const { name, email, password } = createUserForm.value
    //console.log(`name: ${name}, email: ${email}, password: ${password}`)
    const newWorker = new Worker(name)
    this.userService.create({
      displayName: name,
      email: email,
      password: password,
      role: Role.User,
      userData: newWorker
    }).subscribe(
      {
        next: resData => { // resData Object - {uid: string}
          //console.log(resData)

          this.isUserCreated = true
          this.errMessage = null
          createUserForm.reset()

          // set worker id with uid returned from server
          newWorker.id = (resData as {uid: string}).uid
          const workerList = this.workerRepoService.workers
          // update worker list with new worker
          workerList.push(newWorker)
          // populate worker list
          this.workerRepoService.onWorkersChanged.next(workerList)
        },
        error: (err: HttpErrorResponse) => {
          //console.log(err)
          this.isUserCreated = false
          switch (err.status) {
            case 500:
              this.errMessage = err.error.message
              break
            default:
          }
        }
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
