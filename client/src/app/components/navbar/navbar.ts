// packages
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component, effect } from '@angular/core';

// services
import { AuthService } from '../../services';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  isAuth = false;

  constructor(private readonly authService: AuthService) {
    effect(() => {
      const user = this.authService.getUser();
      this.isAuth = !!user;
    });
  }

  logout() {
    this.authService.logout();
  }
}
