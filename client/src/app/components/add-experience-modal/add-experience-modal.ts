// packages
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { Component, effect, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

// services
import { ApiService, AuthService } from '../../services';

// components
import { IconsModule } from '../icons/icons-module';

// libs
import { dateRangeValidator } from '../../lib';

@Component({
  selector: 'app-add-experience-modal',
  imports: [ReactiveFormsModule, CommonModule, IconsModule],
  templateUrl: './add-experience-modal.html',
  styleUrl: './add-experience-modal.scss',
})
export class AddExperienceModal {
  public form: FormGroup;
  public submitted = false;
  toastr = inject(ToastrService);

  @Input() experience: ProfessionalExperience | null = null;
  @Output() closeModalEmitter = new EventEmitter();

  constructor(
    private fb: FormBuilder,
    private readonly apiService: ApiService,
    private readonly authService: AuthService,
  ) {
    effect(() => {
      if (this.experience) {
        this.form.patchValue(this.experience);

        const startedAt = new Date(this.experience.startedAt);
        const localDate = startedAt.toISOString().split('T')[0];
        this.form.get('startedAt')?.setValue(localDate);

        if (this.experience.endedAt) {
          const endedAt = new Date(this.experience.endedAt);
          const localDate = endedAt.toISOString().split('T')[0];
          this.form.get('endedAt')?.setValue(localDate);
        }
      }
    });

    this.form = this.fb.group(
      {
        role: ['', [Validators.required]],
        companyName: ['', [Validators.required]],
        location: ['', [Validators.required]],
        startedAt: ['', [Validators.required]],
        endedAt: [''],
        description: ['', [Validators.required]],
      },
      {
        validators: dateRangeValidator,
      },
    );
  }

  submit() {
    this.submitted = true;

    if (this.form.valid) {
      this.apiService
        .addOrUpdateExperience({
          ...this.form.value,
          id: this.experience?.id,
          startedAt: new Date(this.form.value.startedAt).toISOString(),
          endedAt: this.form.value.endedAt ? new Date(this.form.value.endedAt).toISOString() : null,
        })
        .subscribe({
          next: (res) => {
            if (res.ok) {
              this.toastr.success('Your experience has been updated', 'Experience update', {
                progressBar: false,
                positionClass: 'toast-top-center',
              });
              this.closeModal();
            }
          },
          error: () => { },
        });
    }
  }

  deleteExperience() {
    if (!this.experience?.id) return;

    this.apiService.deleteExperience(this.experience.id).subscribe({
      next: (res) => {
        if (res.ok) {
          this.toastr.success('Your experience has been updated', 'Experience Deleted', {
            progressBar: false,
            positionClass: 'toast-top-center',
          });
          this.closeModal();
        }
      },
      error: () => { },
    });
  }

  closeModal() {
    this.closeModalEmitter.emit();
  }
}
