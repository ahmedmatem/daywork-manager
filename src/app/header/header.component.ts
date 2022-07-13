import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { Role } from '../models/Role';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  isAuthenticated = false
  role: string | null = null
  private userSub!: Subscription

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.userSub = this.authService.user.subscribe(user => {
      this.isAuthenticated = !!user
      this.role = user?.role!
    })
  }

  onLogout() {
    this.authService.logout()
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe()
  }
}
