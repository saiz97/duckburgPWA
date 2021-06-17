import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { NotificationService } from './service/notification.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'DuckburgPWA';
  loggedIn: boolean = false;

  constructor(private notificationService: NotificationService, private authService: AuthService) {}

  ngOnInit(): void {
    this.notificationService.permitNotifications();
    this.authService.isLoggedIn();
    this.authService.loginStatus.subscribe(status => {
      this.loggedIn = status
    })
  }

  onLogout() {
    this.authService.logout();
  }
}
