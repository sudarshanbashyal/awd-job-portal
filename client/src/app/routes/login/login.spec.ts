import { Login } from './login';
import { RouterTestingModule } from '@angular/router/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ApiService, AuthService } from '../../services';
import { of, throwError } from 'rxjs';

describe('Login', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;
  let apiService: jasmine.SpyObj<ApiService>;
  let authService: jasmine.SpyObj<AuthService>;

  // testing component creation
  beforeEach(async () => {
    apiService = jasmine.createSpyObj('ApiService', ['login']);
    authService = jasmine.createSpyObj('AuthService', ['saveUserToken', 'getUser']);

    authService.getUser.and.returnValue(null);

    await TestBed.configureTestingModule({
      imports: [Login, HttpClientTestingModule, RouterTestingModule],
      providers: [
        { provide: ApiService, useValue: apiService },
        { provide: AuthService, useValue: authService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Login);
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
    expect(form.get('email')?.value).toBe('');
    expect(form.get('password')?.value).toBe('');
  });

  // testing form with empty values
  it('should mark form as invalid if empty', () => {
    component.submit();
    expect(component.submitted).toBeTrue();
    expect(component.form.invalid).toBeTrue();
  });

  // valid email/password
  it('should mark form as valid when valid values are set', () => {
    apiService.login.and.returnValue(
      of({ ok: true, data: { accessToken: 'token123' }, errors: [] } as any),
    );

    component.form.get('email')?.setValue('test@example.com');
    component.form.get('password')?.setValue('password123');
    component.submit();
    expect(component.form.valid).toBeTrue();
  });

  it('should not submit if already loading', () => {
    component.loading = true;
    component.form.get('email')?.setValue('test@example.com');
    component.form.get('password')?.setValue('password123');

    component.submit();

    expect(apiService.login).not.toHaveBeenCalled();
  });

  it('should login successfully with valid credentials', () => {
    apiService.login.and.returnValue(
      of({ ok: true, data: { accessToken: 'token123' }, errors: [] } as any),
    );

    component.form.get('email')?.setValue('test@example.com');
    component.form.get('password')?.setValue('password123');

    component.submit();

    expect(apiService.login).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    });
    expect(authService.saveUserToken).toHaveBeenCalledWith('token123');
    expect(component.submissionSuccessful).toBeTrue();
    expect(component.isIncorrectCredentials).toBeFalse();
  });

  it('should set incorrect credentials flag on 404 error', () => {
    const error = { status: 404 };
    apiService.login.and.returnValue(throwError(() => error));

    component.form.get('email')?.setValue('test@example.com');
    component.form.get('password')?.setValue('password123');

    component.submit();

    expect(component.isIncorrectCredentials).toBeTrue();
  });

  it('should set incorrect credentials flag on 401 error', () => {
    const error = { status: 401 };
    apiService.login.and.returnValue(throwError(() => error));

    component.form.get('email')?.setValue('test@example.com');
    component.form.get('password')?.setValue('password123');

    component.submit();

    expect(component.isIncorrectCredentials).toBeTrue();
  });

  it('should reset incorrect credentials flag on email change', () => {
    component.isIncorrectCredentials = true;

    component.form.get('email')?.setValue('newemail@example.com');

    expect(component.isIncorrectCredentials).toBeFalse();
  });

  it('should reset incorrect credentials flag on password change', () => {
    component.isIncorrectCredentials = true;

    component.form.get('password')?.setValue('newpassword');

    expect(component.isIncorrectCredentials).toBeFalse();
  });

  it('should handle other errors gracefully', () => {
    const error = { status: 500 };
    apiService.login.and.returnValue(throwError(() => error));

    component.form.get('email')?.setValue('test@example.com');
    component.form.get('password')?.setValue('password123');

    component.submit();

    expect(component.isIncorrectCredentials).toBeFalse();
  });
});
