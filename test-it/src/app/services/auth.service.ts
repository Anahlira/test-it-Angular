import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { RestApiService } from '../shared/rest-api.service';
import { User } from '../shared/user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  user: {} | null = null;

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
    // "username":"atuny0","password":"9uQFF1Lh"
    this.restApi.loginUser({ email, password }).subscribe((data: User) => {
      console.log(data);
      this.user = { name: data.firstname };
      localStorage.setItem('user', JSON.stringify(this.user));
      this.router.navigate(['/home']);
    });
    // this.user = { name: 'Pesho' };
    // localStorage.setItem('user', JSON.stringify(this.user));
    // this.router.navigate(['/home']);
  }

  signup(user: User): void {
    this.restApi.createUser(user).subscribe((data: User) => {
      console.log(data);
      this.user = { name: data.firstname };
      localStorage.setItem('user', JSON.stringify(this.user));
      this.router.navigate(['/home']);
    });
    // this.user = { name: 'Pesho' };
    // localStorage.setItem('user', JSON.stringify(this.user));
  }

  logout(): void {
    this.restApi.logoutUser();
    this.user = null;
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }
}
