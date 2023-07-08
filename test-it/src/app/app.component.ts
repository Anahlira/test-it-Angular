import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from './dialog/dialog.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(private authService: AuthService, public dialog: MatDialog) {}

  get isLoggedIn() {
    return !!this.authService.user;
  }

  logout(): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        title: `${this.authService?.user?.firstname}, are you sure you want to logout?`,
        confirmText: 'Logout',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.authService.logout();
      }
    });
  }
}
