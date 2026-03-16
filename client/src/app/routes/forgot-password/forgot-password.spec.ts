import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgotPassword } from './forgot-password';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ApiService } from '../../services';
import { of, throwError } from 'rxjs';

describe('ForgotPassword', () => {
  let component: ForgotPassword;
  let fixture: ComponentFixture<ForgotPassword>;
  let apiService: jasmine.SpyObj<ApiService>;

  beforeEach(async () => {
    apiService = jasmine.createSpyObj('ApiService', [
      'generateToken',
      'verifyToken',
      'resetPassword',
    ]);

    await TestBed.configureTestingModule({
      imports: [ForgotPassword, HttpClientTestingModule, RouterTestingModule],
      providers: [{ provide: ApiService, useValue: apiService }],
    }).compileComponents();

    fixture = TestBed.createComponent(ForgotPassword);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the email form with empty values', () => {
    const form = component.emailForm;
    expect(form).toBeDefined();
    expect(form.get('email')?.value).toBe('');
  });

  it('should initialize the token form with empty values', () => {
    const form = component.tokenForm;
    expect(form).toBeDefined();
    expect(form.get('token')?.value).toBe('');
  });

  it('should initialize the password form with empty values', () => {
    const form = component.passwordForm;
    expect(form).toBeDefined();
    expect(form.get('password')?.value).toBe('');
    expect(form.get('confirmPassword')?.value).toBe('');
  });

  it('should show error on password mismatch', () => {
    component.stage = 'password';

    component.passwordForm.setValue({
      password: 'password1',
      confirmPassword: 'password2',
    });
    component.submitPassword();
    expect(component.passwordForm.errors?.['mismatch']).toBeTrue();
  });

  it('shouldnt show error if password is the same', () => {
    component.stage = 'password';

    component.passwordForm.setValue({
      password: 'password1',
      confirmPassword: 'password1',
    });

    apiService.resetPassword.and.returnValue(of({ ok: true }));
    component.submitPassword();
    expect(component.passwordForm.errors?.['mismatch']).toBeFalsy();
  });

  it('should move to token stage when email API succeeds', () => {
    component.emailForm.setValue({ email: 'test@gmail.com' });

    apiService.generateToken.and.returnValue(of({ ok: true }));

    component.submitEmail();

    expect(apiService.generateToken).toHaveBeenCalledWith({
      email: 'test@gmail.com',
    });

    expect(component.stage).toBe('token');
  });

  it('show show error if 404 error found', () => {
    component.emailForm.setValue({ email: 'testuser@gmail.com' });

    apiService.generateToken.and.returnValue(throwError(() => ({ status: 404 })));

    component.submitEmail();

    expect(component.emailNotFound).toBeTrue();
  });

  it('should be successful if valid values are entered for password stage', () => {
    component.stage = 'password';
    component.email = 'testuser@gmail.com';
    component.token = '123456';

    component.passwordForm.setValue({
      password: 'password123',
      confirmPassword: 'password123',
    });

    apiService.resetPassword.and.returnValue(of({ ok: true }));

    component.submitPassword();

    expect(apiService.resetPassword).toHaveBeenCalledWith({
      email: 'testuser@gmail.com',
      token: '123456',
      password: 'password123',
    });

    expect(component.stage).toBe('success');
  });

  it('api should not be called if invalid password in password form', () => {
    component.passwordForm.setValue({
      password: '123',
      confirmPassword: '123',
    });

    component.submitPassword();

    expect(apiService.resetPassword).not.toHaveBeenCalled();
  });
});
