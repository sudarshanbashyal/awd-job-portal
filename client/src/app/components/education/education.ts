// packages
import { CommonModule, DatePipe } from '@angular/common';
import { Component, effect } from '@angular/core';

// services
import { AuthService } from '../../services';

// components
import { IconsModule } from '../icons/icons-module';
import { AddEducationModal } from '../add-education-modal/add-education-modal';

@Component({
  selector: 'app-education',
  imports: [DatePipe, CommonModule, AddEducationModal, IconsModule],
  templateUrl: './education.html',
  styleUrl: './education.scss',
})
export class Education {
  userProfile: UserProfile | null = null;

  modalOpen = false;
  editingEducation: EducationProfile | null = null;

  constructor(private readonly authService: AuthService) {
    effect(() => {
      const user = this.authService.getUser();
      this.userProfile = user;
    });
  }

  openModal(education?: EducationProfile) {
    if (education) this.editingEducation = education;
    this.modalOpen = true;
  }

  closeModal() {
    this.modalOpen = false;
    this.editingEducation = null;
    this.authService.loadUser();
  }
}
