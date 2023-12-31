import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { containsValidator } from '../shared/contains.directive';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { User } from '../shared/user';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent {
  formBuilder = inject(FormBuilder);

  form = this.formBuilder.group({
    email: [
      '',
      [Validators.required, Validators.minLength(4), containsValidator('@')],
      ,
      [],
    ],
    username: ['', [Validators.required, Validators.minLength(4)], []],
    firstname: ['', [Validators.required], []],
    lastname: ['', [Validators.required], []],
    password: ['', [Validators.required], []],
  });

  constructor(private router: Router, private authService: AuthService) {}

  signup(): void {
    // console.log(this.form.value);
    // todo here perform signup
    if (this.form.valid) {
      this.authService.signup(this.form.value as User);

      this.form.reset();
    }
  }

  goToLogin(): void {
    this.router.navigateByUrl('/login');
  }
  getFormControl(name: keyof typeof this.form.controls) {
    return this.form.controls[name];
  }
}
