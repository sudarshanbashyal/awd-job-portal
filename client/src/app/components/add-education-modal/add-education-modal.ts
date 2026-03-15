// packages
import { CommonModule } from '@angular/common';
import { Component, effect, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

// services
import { ApiService, ToastService } from '../../services';

// components
import { IconsModule } from '../icons/icons-module';

// libs
import { dateRangeValidator } from '../../lib';

@Component({
  selector: 'app-add-education-modal',
  imports: [ReactiveFormsModule, CommonModule, IconsModule],
  templateUrl: './add-education-modal.html',
  styleUrl: './add-education-modal.scss',
})
export class AddEducationModal {
  public form: FormGroup;
  public submitted = false;

  @Input() education: EducationProfile | null = null;
  @Output() closeModalEmitter = new EventEmitter();

  constructor(
    private fb: FormBuilder,
    private toastService: ToastService,
    private readonly apiService: ApiService,
  ) {
    effect(() => {
      if (this.education) {
        this.form.patchValue(this.education);

        const startedAt = new Date(this.education.startedAt);
        const localDate = startedAt.toISOString().split('T')[0];
        this.form.get('startedAt')?.setValue(localDate);

        if (this.education.endedAt) {
          const endedAt = new Date(this.education.endedAt);
          const localDate = endedAt.toISOString().split('T')[0];
          this.form.get('endedAt')?.setValue(localDate);
        }
      }
    });

    this.form = this.fb.group(
      {
        course: ['', [Validators.required]],
        instituteName: ['', [Validators.required]],
        location: ['', [Validators.required]],
        startedAt: ['', [Validators.required]],
        endedAt: [''],
        description: [''],
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
        .addOrUpdateEducation({
          ...this.form.value,
          id: this.education?.id,
          startedAt: new Date(this.form.value.startedAt).toISOString(),
          endedAt: this.form.value.endedAt ? new Date(this.form.value.endedAt).toISOString() : null,
        })
        .subscribe({
          next: (res) => {
            if (res.ok) {
              this.toastService.show('Education updated', 'Your experience has been updated');
              this.closeModal();
            }
          },
          error: () => { },
        });
    }
  }

  deleteEducation() {
    if (!this.education?.id) return;

    this.apiService.deleteEducation(this.education.id).subscribe({
      next: (res) => {
        if (res.ok) {
          this.toastService.show('Education Deleted', 'Your education has been updated');
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
