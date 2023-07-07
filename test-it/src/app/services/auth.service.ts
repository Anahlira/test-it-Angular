import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { RestApiService } from '../shared/rest-api.service';
import { User } from '../shared/user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  user: User | null = null;

  constructor(private router: Router, public restApi: RestApiService) {
    this.authenticate();
  }

  authenticate(): void {
    const user = localStorage.getItem('user');
    if (user) {
      this.user = JSON.parse(user);
    }
  }

  login(email: string, password: string): void {
    this.restApi.loginUser({ email, password }).subscribe((data: User) => {
      this.user = data;
      localStorage.setItem('user', JSON.stringify(this.user));
      this.router.navigate(['/home']);
    });
  }

  signup(user: User): void {
    this.restApi.createUser(user).subscribe((data: User) => {
      this.user = data;
      localStorage.setItem('user', JSON.stringify(this.user));
      this.router.navigate(['/home']);
    });
  }

  logout(): void {
    this.restApi.logoutUser().subscribe(() => {
      this.user = null;
      localStorage.removeItem('user');
      this.router.navigate(['/login']);
    });
  }
}
