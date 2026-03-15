// packages
import { CommonModule } from '@angular/common';
import { Component, effect, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

// services
import { ApiService, ToastService } from '../../services';

// components
import { IconsModule } from '../icons/icons-module';

@Component({
  selector: 'app-add-skill-modal',
  imports: [ReactiveFormsModule, CommonModule, IconsModule],
  templateUrl: './add-skill-modal.html',
  styleUrl: './add-skill-modal.scss',
})
export class AddSkillModal {
  public form: FormGroup;
  public submitted = false;

  @Input() skill: UserSkill | null = null;
  @Output() closeModalEmitter = new EventEmitter();

  constructor(
    private fb: FormBuilder,
    private readonly apiService: ApiService,
    private readonly toastService: ToastService,
  ) {
    effect(() => {
      if (this.skill) {
        this.form.patchValue(this.skill);
      }
    });

    this.form = this.fb.group({
      skill: ['', [Validators.required]],
    });
  }

  submit() {
    this.submitted = true;

    if (this.form.valid) {
      this.apiService
        .addOrUpdateSkill({
          ...this.form.value,
          id: this.skill?.id,
        })
        .subscribe({
          next: (res) => {
            if (res.ok) {
              this.toastService.show('Skill updated', 'Your skills have been updated');
              this.closeModal();
            }
          },
          error: () => {},
        });
    }
  }

  deleteSkill() {
    if (!this.skill?.id) return;

    this.apiService.deleteSkill(this.skill.id).subscribe({
      next: (res) => {
        if (res.ok) {
          this.toastService.show('Skill removed', 'Your skills have been updated');
          this.closeModal();
        }
      },
      error: () => {},
    });
  }

  closeModal() {
    this.closeModalEmitter.emit();
  }
}
