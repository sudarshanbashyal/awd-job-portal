// packages
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

// services
import { ToastService } from '../../services';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.html',
  styleUrl: './toast.scss',
})
export class Toast {
  toast$;

  constructor(private toastService: ToastService) {
    this.toast$ = this.toastService.toastState$;
  }
}
