// packages
import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';

export interface ToastMessage {
  title: string;
  text: string;
  type: 'success' | 'error' | 'warning';
}
@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private toastSubject = new BehaviorSubject<ToastMessage | null>(null);
  toastState$ = this.toastSubject.asObservable();

  show(title: string, message: string, type: 'success' | 'error' | 'warning' = 'success') {
    this.toastSubject.next({ title, text: message, type });
    setTimeout(() => {
      this.toastSubject.next(null);
    }, 3000);
  }
}
