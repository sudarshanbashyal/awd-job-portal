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
});
