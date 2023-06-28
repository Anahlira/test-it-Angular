import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from "@angular/router";

import { AuthService } from "../services/auth.service";

@Injectable({ providedIn: "root" })
export class AuthActivate implements CanActivate {
  constructor(private router: Router, private authService: AuthService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const noAuthenticationRequired =
      route.data["authenticationRequired"] === false;

    if (noAuthenticationRequired) {
      return !!this.authService.user ? this.router.parseUrl("/home") : true;
    }

    return !!this.authService.user ? true : this.router.parseUrl("/login");
  }
}
