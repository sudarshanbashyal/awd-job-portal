// packages
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

// services
import { ApiService, ToastService } from '../../services';

@Component({
  selector: 'app-change-status-modal',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './change-status-modal.html',
  styleUrl: './change-status-modal.scss',
})
export class ChangeStatusModal {
  public form: FormGroup;

  @Input() selectedStatus: ApplicantStatusOption | null = null;
  @Input() application: JobApplicant | null = null;
  @Output() closeModalEmitter = new EventEmitter();

  constructor(
    private fb: FormBuilder,
    private toastService: ToastService,
    private readonly apiService: ApiService,
  ) {
    this.form = this.fb.group({
      note: [''],
    });
  }

  changeStatus() {
    if(!this.application || !this.selectedStatus) return;

    this.apiService.updateApplicationStatus(this.application?.jobId, this.application?.id, {
      status: this.selectedStatus.value,
      note: this.form.get('note')?.value,
    }).subscribe(({
      next:(res)=>{
        if(res.ok){
          this.toastService.show("Application updated", "The status of the applicant has been changed");
          this.closeModal();
        }
      }
    }))
  }

  closeModal() {
    this.closeModalEmitter.emit();
  }
}
