import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobFilter } from './job-filter';

describe('JobFilter', () => {
  let component: JobFilter;
  let fixture: ComponentFixture<JobFilter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobFilter],
    }).compileComponents();

    fixture = TestBed.createComponent(JobFilter);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with empty values', () => {
    const form = component.form;
    expect(form).toBeDefined();
    expect(form.get('search')?.value).toBe('');
    expect(form.get('location')?.value).toBe('');
    expect(form.get('salaryTo')?.value).toBe(null);
    expect(form.get('salaryFrom')?.value).toBe(null);
    expect(form.get('arrangement')?.value).toBe('');
    expect(form.get('workType')?.value).toBe('');
  });

  // testing form with empty values
  it('should allow empty searches since no required values are present', () => {
    component.search();
    expect(component.form.invalid).toBeFalse();
  });

  // testing with valid and invalid salary Ranges
  it('should mark form as invalid when invalid invalid salary range is entered', () => {
    component.form.get('salaryFrom')?.setValue(50000);
    component.form.get('salaryTo')?.setValue(40000);
    component.search();
    expect(component.form.hasError('invalidSalary')).toBeTrue();
  });

  it('should mark form as valid when valid salary range is entered', () => {
    component.form.get('salaryFrom')?.setValue(40000);
    component.form.get('salaryTo')?.setValue(50000);
    component.search();
    expect(component.form.hasError('invalidSalary')).toBeFalse();
  });
});
