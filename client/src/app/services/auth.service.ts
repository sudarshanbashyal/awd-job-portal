// packages
import { Injectable, signal } from '@angular/core';

// services
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private token = signal<string | null>(null);
  user = signal<UserProfile | null>(null);

  constructor(private api: ApiService) { }

  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));

      const expiry = payload.exp * 1000;

      return Date.now() > expiry;
    } catch (e) {
      console.error(e);
      return true;
    }
  }

  saveUserToken(token: string) {
    localStorage.setItem('access-token', token);
    this.token.set(token);

    this.loadUser();
  }

  loadUserToken() {
    const token = localStorage.getItem('access-token');
    if (token) {
      // clear tokens in case of faulty/expired token
      if (this.isTokenExpired(token)) {
        this.logout();
        return;
      }

      this.token.set(token);
    }
  }

  getUserToken() {
    return this.token();
  }

  loadUser() {
    this.api.getProfile().subscribe({
      next: (res) => {
        if (res.ok) {
          this.user.set(res.data);
        }
      },
    });
  }

  getUser() {
    return this.user();
  }

  logout() {
    localStorage.removeItem('access-token');
    this.token.set(null);
    this.user.set(null);
  }
}
