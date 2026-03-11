import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicantProfileForm } from './applicant-profile-form';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ApplicantProfileForm', () => {
  let component: ApplicantProfileForm;
  let fixture: ComponentFixture<ApplicantProfileForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApplicantProfileForm, HttpClientTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(ApplicantProfileForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with empty values', () => {
    const form = component.form;
    expect(form).toBeDefined();
    expect(form.get('firstName')?.value).toBe('');
    expect(form.get('lastName')?.value).toBe('');
    expect(form.get('profile')?.value).toBe('');
    expect(form.get('location')?.value).toBe('');
    expect(form.get('phoneNumber')?.value).toBe('');
  });

  // testing form with empty values
  it('should mark form as invalid if empty', () => {
    component.submit();
    expect(component.submitted).toBeTrue();
    expect(component.form.invalid).toBeTrue();
  });

  // valid form
  it('should mark form as valid when valid values are set', () => {
    component.form.get('firstName')?.setValue('John');
    component.form.get('lastName')?.setValue('Doe');
    component.submit();
    expect(component.form.valid).toBeTrue();
  });

  it('should mark form as invalid when invalid number is entered', () => {
    component.form.get('phoneNumber')?.setValue('+abcdef');
    component.submit();
    expect(component.form.get('phoneNumber')?.hasError('invalidPhoneNumber')).toBeTrue();
  });

  it('should mark form as valid when valid number is entered', () => {
    component.form.get('phoneNumber')?.setValue('+123456789');
    component.submit();
    expect(component.form.get('phoneNumber')?.hasError('invalidPhoneNumber')).toBeFalse();
  });
});
