import { Component, Input } from '@angular/core';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-profile-picture',
  imports: [],
  templateUrl: './profile-picture.html',
  styleUrl: './profile-picture.scss',
})
export class ProfilePicture {
  @Input() profile?: Applicant | Recruiter | null = null;
  @Input() profilePicture?: string | null = null;
  @Input() avatarType: 'Small' | 'Big' = 'Small';
  avatarUrl: string = '';

  ngOnChanges() {
    if (this.profile || this.profilePicture) {
      this.avatarUrl =
        this.profilePicture ||
        `${environment.avatarApiUrl}&name=${this.profile?.firstName}+${this.profile?.lastName}`;
    }
  }
}
