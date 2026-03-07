import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobFilter } from './job-filter';

describe('JobFilter', () => {
  let component: JobFilter;
  let fixture: ComponentFixture<JobFilter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobFilter]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobFilter);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
