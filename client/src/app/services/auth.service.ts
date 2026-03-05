// packages
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Injectable } from '@angular/core';

// services
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private userSubject = new BehaviorSubject<User | null>(null);
  private accessTokenSubject = new BehaviorSubject<AccessToken | null>(null);

  user$ = this.userSubject.asObservable();

  constructor(private api: ApiService) { }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.api.login(credentials).pipe(tap((res) => this.accessTokenSubject.next(res.data)));
  }

  logout() {
    this.userSubject.next(null);
  }
}
