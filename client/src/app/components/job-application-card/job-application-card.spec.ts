import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobApplicationCard } from './job-application-card';

describe('JobApplicationCard', () => {
  let component: JobApplicationCard;
  let fixture: ComponentFixture<JobApplicationCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobApplicationCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobApplicationCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
