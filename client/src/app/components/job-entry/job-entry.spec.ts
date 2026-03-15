import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobEntry } from './job-entry';
import { RouterTestingModule } from '@angular/router/testing';

describe('JobEntry', () => {
  let component: JobEntry;
  let fixture: ComponentFixture<JobEntry>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobEntry, RouterTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(JobEntry);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should format date when application changes', () => {
    component.jobEntry = {
      createdAt: '2025-03-01T00:00:00Z',
    } as JobResultEntry;

    component.ngOnChanges();

    expect(component.formattedDate).toBe('01 Mar, 2025');
  });
});
