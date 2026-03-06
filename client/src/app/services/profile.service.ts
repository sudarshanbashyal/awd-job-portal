// packages
import { firstValueFrom } from 'rxjs';
import { Injectable, signal } from '@angular/core';

// service
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class ProfileService {
  profile = signal<any | null>(null);

  constructor(private api: ApiService) {}

  async loadProfile() {
    if (this.profile()) return this.profile();

    const profileData = this.api.getProfile();
    console.log(profileData);

    this.profile.set(profileData);

    return profileData;
  }
}
