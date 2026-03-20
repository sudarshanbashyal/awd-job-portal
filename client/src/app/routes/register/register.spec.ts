import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Register } from './register';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ApiService, AuthService, ToastService } from '../../services';
import { of, throwError } from 'rxjs';

describe('Register', () => {
  let component: Register;
  let fixture: ComponentFixture<Register>;
  let apiService: jasmine.SpyObj<ApiService>;
  let authService: jasmine.SpyObj<AuthService>;
  let toastService: jasmine.SpyObj<ToastService>;

  beforeEach(async () => {
    apiService = jasmine.createSpyObj('ApiService', ['register']);
    authService = jasmine.createSpyObj('AuthService', ['getUser']);
    toastService = jasmine.createSpyObj('ToastService', ['show']);

    authService.getUser.and.returnValue(null);

    await TestBed.configureTestingModule({
      imports: [Register, HttpClientTestingModule, RouterTestingModule],
      providers: [
        { provide: ApiService, useValue: apiService },
        { provide: AuthService, useValue: authService },
        { provide: ToastService, useValue: toastService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Register);
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
    expect(form.get('email')?.value).toBe('');
    expect(form.get('password')?.value).toBe('');
    expect(form.get('repeatPassword')?.value).toBe('');
    expect(form.get('role')?.value).toBe('');
    expect(form.get('companyName')?.value).toBe('');
    expect(form.get('companyAddress')?.value).toBe('');
  });

  // testing form with empty values
  it('should mark form as invalid if empty', () => {
    component.submit();
    expect(component.submitted).toBeTrue();
    expect(component.form.invalid).toBeTrue();
  });

  it('should add required validators when role is RECRUITER', () => {
    const roleControl = component.form.get('role');
    const companyName = component.form.get('companyName');
    const companyAddress = component.form.get('companyAddress');

    roleControl?.setValue('RECRUITER');

    expect(companyName?.hasError('required')).toBeTrue();
    expect(companyAddress?.hasError('required')).toBeTrue();
  });

  // different passwords test
  it('should mark form as invalid when passwords are different', () => {
    component.form.get('password')?.setValue('123456789');
    component.form.get('repeatPassword')?.setValue('adfadfadf');
    component.submit();
    expect(component.form.hasError('passwordMismatch')).toBeTrue();
  });

  // same passwords test
  it('should mark form as valid when passwords are same', () => {
    component.form.get('password')?.setValue('123456789');
    component.form.get('repeatPassword')?.setValue('123456789');
    component.submit();
    expect(component.form.hasError('passwordMismatch')).toBeFalse();
  });

  it('should register successfully as APPLICANT', () => {
    apiService.register.and.returnValue(
      of({ ok: true, data: { id: 'user1' }, errors: [] } as any),
    );

    component.form.patchValue({
      firstName: 'test',
      lastName: 'user',
      email: 'testuser@gmail.com',
      password: '123456789',
      repeatPassword: '123456789',
      role: 'APPLICANT',
    });

    component.submit();

    expect(apiService.register).toHaveBeenCalled();
    expect(toastService.show).toHaveBeenCalledWith('Account created', 'Redirecting you to login');
  });

  it('should register successfully as RECRUITER with company info', () => {
    apiService.register.and.returnValue(
      of({ ok: true, data: { id: 'user1' }, errors: [] } as any),
    );

    component.form.patchValue({
      firstName: 'test',
      lastName: 'user',
      email: 'testuser@gmail.com',
      password: '123456789',
      repeatPassword: '123456789',
      role: 'RECRUITER',
      companyName: 'abc',
      companyAddress: 'hildesheim',
    });

    component.submit();

    expect(apiService.register).toHaveBeenCalled();
    expect(component.form.valid).toBeTrue();
  });

  it('should not submit if already loading', () => {
    component.loading = true;

    component.form.patchValue({
      firstName: 'test',
      lastName: 'user',
      email: 'testuser@gmail.com',
      password: '123456789',
      repeatPassword: '123456789',
      role: 'APPLICANT',
    });

    component.submit();

    expect(apiService.register).not.toHaveBeenCalled();
  });

  it('should not submit if already successful', () => {
    component.submissionSuccessful = true;

    component.form.patchValue({
      firstName: 'test',
      lastName: 'user',
      email: 'testuser@gmail.com',
      password: '1234123123',
      repeatPassword: '1234123123',
      role: 'APPLICANT',
    });

    component.submit();

    expect(apiService.register).not.toHaveBeenCalled();
  });

  it('should handle duplicate email error', () => {
    const error = { status: 400 };
    apiService.register.and.returnValue(throwError(() => error));

    component.form.patchValue({
      firstName: 'test',
      lastName: 'user',
      email: 'testuser@gmail.com',
      password: 'Password123',
      repeatPassword: 'Password123',
      role: 'APPLICANT',
    });

    component.submit();

    expect(component.form.hasError('duplicateEmail')).toBeTrue();
  });
});
