import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { User } from '../user';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  signupForm: FormGroup;
  signupError: boolean = false;

  constructor(private fb: FormBuilder,
              private authService: AuthService,
              private router: Router) { }

  ngOnInit(): void {
    this.signupForm = this.fb.group({
      username: ["", [Validators.required]],
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required]]
    });
  }

  onSignup() {
    const val = this.signupForm.value;
    console.log("Signup with ...", val.username, val.email, val.password)

    if (val.username && val.email && val.password) {
      this.authService.signup(val.username, val.email, val.password).subscribe(response => {
        console.info("Signup successful.", response)

        this.authService.login(val.username, val.password).subscribe(response => {
          console.info("Login successful. ", response)
          this.authService.setSessionStorage(response.token, new User(
            this.authService.decodeTokenForId(response.token),
            response.user_email,
            response.user_nicename,
            response.user_display_name
          ));

          this.authService.loginStatus.next(true);
          this.router.navigate(['ads']);
        });
      })
    } else {
      console.error("Login failed.")
      this.signupForm.reset();
      this.signupError = true;
    }
  }

}
