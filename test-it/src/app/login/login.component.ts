import { Component, ViewChildren, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { FormBuilder, Validators } from '@angular/forms';
import { containsValidator } from '../shared/contains.directive';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  email!: string;
  password!: string;
  formBuilder = inject(FormBuilder);

  form = this.formBuilder.group({
    email: [
      this.email,
      [
        Validators.required,
        Validators.minLength(4),
         containsValidator('@')
      ],
      ,
      [],
    ],
    password: [this.password, [Validators.required], []],
  });

  constructor(private router: Router, private authService: AuthService) {}

  login(): void {
    console.log(this.form);
    // todo here perform login
    if (this.form.valid) {
      this.authService.login(
        this.form.value?.email ?? '',
        this.form.value.password ?? ''
      );

      this.form.reset();
    }
  }

  goToSignUp(): void {
    this.router.navigateByUrl('/signup');
  }
}
