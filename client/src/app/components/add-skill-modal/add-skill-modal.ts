// packages
import { Component, effect, EventEmitter, inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

// components
import { IconsModule } from '../icons/icons-module';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../../services';

@Component({
  selector: 'app-add-skill-modal',
  imports: [ReactiveFormsModule, CommonModule, IconsModule],
  templateUrl: './add-skill-modal.html',
  styleUrl: './add-skill-modal.scss',
})
export class AddSkillModal {
  public form: FormGroup;
  public submitted = false;
  toastr = inject(ToastrService);

  @Input() skill: UserSkill | null = null;
  @Output() closeModalEmitter = new EventEmitter();

  constructor(
    private fb: FormBuilder,
    private readonly apiService: ApiService,
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
              this.toastr.success('Your skills have been udpated', 'Skill updated', {
                progressBar: false,
                positionClass: 'toast-top-center',
              });
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
          this.toastr.success('Your skills have been updated', 'Skills updated', {
            progressBar: false,
            positionClass: 'toast-top-center',
          });
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
