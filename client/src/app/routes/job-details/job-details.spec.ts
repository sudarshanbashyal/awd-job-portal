import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobDetails } from './job-details';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('JobDetails', () => {
  let component: JobDetails;
  let fixture: ComponentFixture<JobDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobDetails, HttpClientTestingModule, RouterTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(JobDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
