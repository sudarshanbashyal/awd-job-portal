import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobPostingCard } from './job-posting-card';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('JobPostingCard', () => {
  let component: JobPostingCard;
  let fixture: ComponentFixture<JobPostingCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobPostingCard, HttpClientTestingModule, RouterTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(JobPostingCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should format date', () => {
    component.jobPost = {
      createdAt: '2025-03-01',
    } as JobPostingsWithApplicationsCount;

    component.ngOnChanges();

    expect(component.formattedDate).toBe('01 Mar, 2025');
  });
});
