import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobEntry } from './job-entry';

describe('JobEntry', () => {
  let component: JobEntry;
  let fixture: ComponentFixture<JobEntry>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobEntry]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobEntry);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
