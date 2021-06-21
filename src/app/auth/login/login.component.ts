import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from '../user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  currentUser: User;
  loginError: boolean = false;

  constructor(private fb: FormBuilder,
              private authService: AuthService,
              private router: Router) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ["", [Validators.required]],
      password: ["", [Validators.required]]
    });

    this.currentUser = this.authService.getCurrentUser();
  }

  isLoggedIn() {
    return this.authService.isLoggedIn();
  }

  onLogout() {
    this.authService.logout();
  }

  onLogin() {
    const val = this.loginForm.value;

    if(val.username && val.password) {
      this.authService.login(val.username, val.password).subscribe(response => {
        console.info("Login successful. ", response)
        this.authService.setSessionStorage(response.token, new User(
          this.authService.decodeTokenForId(response.token),
          response.user_email,
          response.user_nicename,
          response.user_display_name
        ));
        this.currentUser = this.authService.getCurrentUser();
        this.loginError = false;
        this.authService.loginStatus.next(true);
        this.router.navigate(['ads']);
      }, (err) => {
        console.error("Login failed.", err)
        this.loginForm.reset();
        this.loginError = true;
      });
    } else {
      console.error("Login failed.")
      this.loginForm.reset();
      this.loginError = true;
    }
  }

}
