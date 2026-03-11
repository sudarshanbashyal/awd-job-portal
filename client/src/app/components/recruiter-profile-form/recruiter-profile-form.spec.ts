import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecruiterProfileForm } from './recruiter-profile-form';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('RecruiterProfileForm', () => {
  let component: RecruiterProfileForm;
  let fixture: ComponentFixture<RecruiterProfileForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecruiterProfileForm, HttpClientTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(RecruiterProfileForm);
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
    expect(form.get('firstName')?.value).toBe('');
    expect(form.get('lastName')?.value).toBe('');
    expect(form.get('companyName')?.value).toBe('');
    expect(form.get('companyAddress')?.value).toBe('');
  });

  // testing form with empty values
  it('should mark form as invalid if empty', () => {
    component.submit();
    expect(component.submitted).toBeTrue();
    expect(component.form.invalid).toBeTrue();
  });

  // valid form test
  it('should mark form as valid when valid values are present', () => {
    component.form.get('firstName')?.setValue('John');
    component.form.get('lastName')?.setValue('Doe');
    component.form.get('companyName')?.setValue('Company abc');
    component.form.get('companyAddress')?.setValue('Hildesheim');
    component.submit();
    expect(component.form.valid).toBeTrue();
  });
});
