// packages
import { CommonModule } from '@angular/common';
import { Component, effect } from '@angular/core';

// services
import { AuthService } from '../../services';

// components
import { Tag } from '../tag/tag';
import { IconsModule } from '../icons/icons-module';
import { AddSkillModal } from '../add-skill-modal/add-skill-modal';

@Component({
  selector: 'app-skill',
  imports: [CommonModule, IconsModule, AddSkillModal, Tag],
  templateUrl: './skill.html',
  styleUrl: './skill.scss',
})
export class Skill {
  userProfile: UserProfile | null = null;

  modalOpen = false;
  editingSkill: UserSkill | null = null;

  constructor(private readonly authService: AuthService) {
    effect(() => {
      const user = this.authService.getUser();
      this.userProfile = user;
    });
  }

  openModal(skill?: UserSkill) {
    if (skill) this.editingSkill = skill;
    this.modalOpen = true;
  }

  closeModal() {
    this.modalOpen = false;
    this.editingSkill = null;
    this.authService.loadUser();
  }
}
