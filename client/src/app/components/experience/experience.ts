import { CommonModule, DatePipe } from '@angular/common';
import { Component, effect } from '@angular/core';

// services
import { AuthService } from '../../services';

// components
import { IconsModule } from '../icons/icons-module';
import { AddExperienceModal } from '../add-experience-modal/add-experience-modal';

@Component({
  selector: 'app-experience',
  imports: [DatePipe, IconsModule, AddExperienceModal, CommonModule],
  templateUrl: './experience.html',
  styleUrl: './experience.scss',
})
export class Experience {
  userProfile: UserProfile | null = null;

  modalOpen = false;
  editingExperience: ProfessionalExperience | null = null;

  constructor(private readonly authService: AuthService) {
    effect(() => {
      const user = this.authService.getUser();
      this.userProfile = user;
    });
  }

  openModal(experience?: ProfessionalExperience) {
    if (experience) this.editingExperience = experience;
    this.modalOpen = true;
  }

  closeModal() {
    this.modalOpen = false;
    this.editingExperience = null;
    this.authService.loadUser();
  }
}
