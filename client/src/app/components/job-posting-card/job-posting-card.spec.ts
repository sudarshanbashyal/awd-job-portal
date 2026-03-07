import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobPostingCard } from './job-posting-card';

describe('JobPostingCard', () => {
  let component: JobPostingCard;
  let fixture: ComponentFixture<JobPostingCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobPostingCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobPostingCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
