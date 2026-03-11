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

  // testing form creation with empty values
  it('should initialize the form with empty values', () => {
    const form = component.form;
    expect(form).toBeDefined();
    expect(form.get('search')?.value).toBe('');
    expect(form.get('status')?.value).toBe('');
  });

  // testing form with empty values
  it('should mark form as valid even if empty since no required fields', () => {
    component.search();
    expect(component.form.valid).toBeTrue();
  });
});
