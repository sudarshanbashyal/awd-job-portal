import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobApplicationCard } from './job-application-card';
import { RouterTestingModule } from '@angular/router/testing';

describe('JobApplicationCard', () => {
  let component: JobApplicationCard;
  let fixture: ComponentFixture<JobApplicationCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobApplicationCard, RouterTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(JobApplicationCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should format date when application changes', () => {
    component.application = {
      createdAt: '2025-03-01T00:00:00Z',
    };

    component.ngOnChanges();

    expect(component.formattedDate).toBe('01 Mar, 2025');
  });
});
