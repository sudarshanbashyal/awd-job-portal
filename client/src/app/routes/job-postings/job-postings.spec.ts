import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobPostings } from './job-postings';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('JobPostings', () => {
  let component: JobPostings;
  let fixture: ComponentFixture<JobPostings>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobPostings, HttpClientTestingModule, RouterTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(JobPostings);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
