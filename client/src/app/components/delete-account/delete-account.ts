// packages
import { ToastrService } from 'ngx-toastr';
import { Component, inject } from '@angular/core';

// services
import { ApiService, AuthService } from '../../services';

@Component({
  selector: 'app-delete-account',
  imports: [],
  templateUrl: './delete-account.html',
  styleUrl: './delete-account.scss',
})
export class DeleteAccount {
  toastr = inject(ToastrService);

  constructor(
    private readonly apiService: ApiService,
    private readonly authService: AuthService,
  ) {}

  deleteAccount() {
    this.apiService.deleteAccount().subscribe({
      next: (res) => {
        if (res.ok) {
          this.toastr.success('Your account has been deleted', 'Account Deleted', {
            progressBar: false,
            positionClass: 'toast-top-center',
          });
          this.authService.logout();
        }
      },
      error: () => {},
    });
  }
}
