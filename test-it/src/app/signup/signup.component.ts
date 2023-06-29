import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { containsValidator } from '../shared/contains.directive';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

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
    firstName: ['', [Validators.required], []],
    lastName: ['', [Validators.required], []],
    password: ['', [Validators.required], []],
  });

  constructor(private router: Router, private authService: AuthService) {}

  signup(): void {
    console.log(this.form);
    // todo here perform signup
    if (this.form.valid) {
      this.authService.signup();

      this.form.reset();
      this.router.navigate(['/home']);
    }
  }

  goToLogin(): void {
    this.router.navigateByUrl('/login');
  }
}
