import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicantProfileForm } from './applicant-profile-form';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { ApiService, AuthService, ToastService } from '../../services';

describe('ApplicantProfileForm', () => {
  let component: ApplicantProfileForm;
  let fixture: ComponentFixture<ApplicantProfileForm>;
  let apiService: jasmine.SpyObj<ApiService>;
  let toastService: jasmine.SpyObj<ToastService>;
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    apiService = jasmine.createSpyObj('ApiService', ['updateApplicantProfile']);
    toastService = jasmine.createSpyObj('ToastService', ['show']);
    authService = jasmine.createSpyObj('AuthService', ['loadUser', 'getUser']);

    authService.getUser.and.returnValue(null);
    apiService.updateApplicantProfile.and.returnValue(
      of({ ok: true, data: { id: 'abc' }, errors: [] } as any),
    );

    await TestBed.configureTestingModule({
      imports: [ApplicantProfileForm, HttpClientTestingModule],
      providers: [
        { provide: ApiService, useValue: apiService },
        { provide: ToastService, useValue: toastService },
        { provide: AuthService, useValue: authService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ApplicantProfileForm);
    component = fixture.componentInstance;
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

  it('should call API and show toast when form is valid and response ok', () => {
    apiService.updateApplicantProfile.and.returnValue(
      of({ ok: true, data: { id: 'abc' }, errors: [] } as any),
    );

    component.form.setValue({
      firstName: 'test',
      lastName: 'user',
      profile: '',
      location: '',
      phoneNumber: '+123456789',
    });

    component.submit();

    expect(component.submitted).toBeTrue();
    expect(apiService.updateApplicantProfile).toHaveBeenCalledWith(component.form.value);
    expect(authService.loadUser).toHaveBeenCalled();
    expect(toastService.show).toHaveBeenCalledWith(
      'Profile Updated',
      'Your profile has been successfully updated',
    );
  });

  it('should show toast even if response not ok', () => {
    apiService.updateApplicantProfile.and.returnValue(
      of({ ok: false, data: null, errors: [] } as any),
    );

    component.form.setValue({
      firstName: 'test',
      lastName: 'user',
      profile: '',
      location: '',
      phoneNumber: '+123456789',
    });

    component.submit();

    expect(toastService.show).toHaveBeenCalledWith(
      'Profile Updated',
      'Your profile has been successfully updated',
    );
    expect(authService.loadUser).not.toHaveBeenCalled();
  });

  it('should handle update error gracefully', () => {
    apiService.updateApplicantProfile.and.returnValue(
      throwError(() => new Error('fail')),
    );

    component.form.setValue({
      firstName: 'test',
      lastName: 'user',
      profile: '',
      location: '',
      phoneNumber: '+123456789',
    });

    component.submit();

    expect(component.submitted).toBeTrue();
  });

  it('should populate form when user profile is loaded via effect', () => {
    const mockProfile = {
      applicant: {
        firstName: 'John',
        lastName: 'Doe',
        location: 'Berlin',
        phoneNumber: '+123456789',
      },
    } as any;

    authService.getUser.and.returnValue(mockProfile);
    fixture.detectChanges();

    expect(component.profile).toEqual(mockProfile);
  });
});
