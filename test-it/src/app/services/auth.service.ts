import { Injectable } from "@angular/core";
import { Router } from "@angular/router";

@Injectable({ providedIn: "root" })
export class AuthService {
  user: {} | null = null;

  constructor(private router: Router) {
    this.authenticate();
  }

  authenticate(): void {
    const user = localStorage.getItem("user");
    if (user) {
      this.user = JSON.parse(user);
    }
  }

  login(): void {
    this.user = { name: "Pesho" };
    localStorage.setItem("user", JSON.stringify(this.user));
  }

  logout(): void {
    this.user = null;
    localStorage.removeItem("user");
    this.router.navigate(["/login"]);
  }
}
