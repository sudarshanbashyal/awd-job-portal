import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecruiterProfileForm } from './recruiter-profile-form';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ApiService, AuthService, ToastService } from '../../services';
import { of } from 'rxjs';

describe('RecruiterProfileForm', () => {
  let component: RecruiterProfileForm;
  let fixture: ComponentFixture<RecruiterProfileForm>;

  let apiService: jasmine.SpyObj<ApiService>;
  let authService: jasmine.SpyObj<AuthService>;
  let toastService: jasmine.SpyObj<ToastService>;

  const user = {
    id: '123',
    email: 'abc@gmail.com',
    role: 'RECRUITER' as UserType,
    recruiter: {
      id: '2345',
      userId: '123',
      firstName: 'test ',
      lastName: 'user',
      companyName: 'test company',
      companyAddress: 'hildesheim',
    },
  };

  beforeEach(async () => {
    apiService = jasmine.createSpyObj('ApiService', ['updateRecruiterProfile']);
    authService = jasmine.createSpyObj('AuthService', ['getUser', 'loadUser']);
    toastService = jasmine.createSpyObj('ToastService', ['show']);

    authService.getUser.and.returnValue(user);

    apiService.updateRecruiterProfile.and.returnValue(
      of({ ok: true, data: { id: '123' }, errors: [] }),
    );

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RecruiterProfileForm],
      providers: [
        { provide: ApiService, useValue: apiService },
        { provide: AuthService, useValue: authService },
        { provide: ToastService, useValue: toastService },
      ],
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
    component.form.setValue({
      firstName: '',
      lastName: '',
      companyName: '',
      companyAddress: '',
    });
    const form = component.form;
    expect(form).toBeDefined();
    expect(form.get('firstName')?.value).toBe('');
    expect(form.get('lastName')?.value).toBe('');
    expect(form.get('companyName')?.value).toBe('');
    expect(form.get('companyAddress')?.value).toBe('');
  });

  // testing form with empty values
  it('should mark form as invalid if empty', () => {
    component.form.reset();

    component.submit();

    expect(component.submitted).toBeTrue();
    expect(component.form.invalid).toBeTrue();
  });

  // valid form test
  it('should mark form as valid when valid values are present', () => {
    component.form.get('firstName')?.setValue('test');
    component.form.get('lastName')?.setValue('user');
    component.form.get('companyName')?.setValue('abc');
    component.form.get('companyAddress')?.setValue('hildesheim');
    component.submit();
    expect(component.form.valid).toBeTrue();
  });

  it('should show toast after successful update', () => {
    component.form.setValue({
      firstName: 'test',
      lastName: 'user',
      companyName: 'test company',
      companyAddress: 'hildesheim',
    });

    component.submit();

    expect(toastService.show).toHaveBeenCalledWith(
      'Profile Updated',
      'Your profile has been successfully updated',
    );
  });
});
