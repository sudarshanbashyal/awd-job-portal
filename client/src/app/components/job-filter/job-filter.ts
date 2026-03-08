// packages
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

// component
import { IconsModule } from '../icons/icons-module';

// libs
import { salaryRangeValidator } from '../../lib';

@Component({
  selector: 'app-job-filter',
  imports: [IconsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './job-filter.html',
  styleUrl: './job-filter.scss',
})
export class JobFilter {
  public form: FormGroup;

  @Output() searchEventEmitter = new EventEmitter<SearchJobRequest>();

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group(
      {
        search: [''],
        location: [''],
        salaryTo: [null, []],
        salaryFrom: [null, []],
        arrangement: [''],
        workType: [''],
      },
      {
        validators: salaryRangeValidator,
      },
    );
  }

  search() {
    if (this.form.valid) {
      this.searchEventEmitter.emit(this.form.value);
    }
  }
}
