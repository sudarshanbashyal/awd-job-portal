import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobApplicants } from './job-applicants';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('JobApplicants', () => {
  let component: JobApplicants;
  let fixture: ComponentFixture<JobApplicants>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobApplicants, HttpClientTestingModule, RouterTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobApplicants);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
