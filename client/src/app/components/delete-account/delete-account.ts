// packages
import { Component } from '@angular/core';

// services
import { ApiService, AuthService, ToastService } from '../../services';

@Component({
  selector: 'app-delete-account',
  imports: [],
  templateUrl: './delete-account.html',
  styleUrl: './delete-account.scss',
})
export class DeleteAccount {
  constructor(
    private readonly apiService: ApiService,
    private readonly authService: AuthService,
    private readonly toastService: ToastService,
  ) { }

  deleteAccount() {
    this.apiService.deleteAccount().subscribe({
      next: (res) => {
        if (res.ok) {
          this.toastService.show('Account Deleted', 'Your account has been deleted');
          this.authService.logout();
        }
      },
      error: () => { },
    });
  }
}
