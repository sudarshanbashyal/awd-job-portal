// packages
import { CommonModule } from '@angular/common';
import { Component, effect, EventEmitter, Input, Output } from '@angular/core';

// services
import { ApiService, AuthService } from '../../services';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-assessment-modal',
  imports: [CommonModule],
  templateUrl: './assessment-modal.html',
  styleUrl: './assessment-modal.scss',
})
export class AssessmentModal {
  public assessmentLoading = false;
  public token: string = '';

  public applicationAssessment: AssessmentReport | null = null;
  public assessmentProgress: number = 0;
  public assessmentFailed: boolean = false;

  @Input() jobId: string = '';
  @Output() closeModalEmitter = new EventEmitter();

  constructor(
    private readonly apiService: ApiService,
    private readonly authService: AuthService,
  ) {
    effect(() => {
      const token = this.authService.getUserToken();
      if (token) this.token = token;

      if (this.jobId && token) this.assessApplication();
    });
  }

  closeModal() {
    this.closeModalEmitter.emit();
    this.apiService.disconnectAssessmentStream();
  }

  assessApplication() {
    if (this.assessmentLoading || !this.jobId || !this.token) return;

    this.apiService
      .streamApplicationAssessment(this.jobId, `Bearer ${this.token}`)
      .pipe(
        finalize(() => {
          this.assessmentLoading = false;
        }),
      )
      .subscribe({
        next: (data) => {
          if (!data.done && data.progress) {
            this.assessmentProgress = data.progress;
          } else if (data.done && data.assessment) {
            this.applicationAssessment = data.assessment;
            this.assessmentLoading = true;
          }
        },
        error: (err) => {
          console.log('err: ', err);
          if (!this.applicationAssessment) {
            this.assessmentFailed = true;
          }
        },
      });
  }
}
