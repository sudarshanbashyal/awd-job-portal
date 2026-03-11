import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Register } from './register';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('Register', () => {
  let component: Register;
  let fixture: ComponentFixture<Register>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Register, HttpClientTestingModule, RouterTestingModule],
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
    component.form.get('password')?.setValue('Admin@1234');
    component.form.get('repeatPassword')?.setValue('Admin1234');
    component.submit();
    expect(component.form.hasError('passwordMismatch')).toBeTrue();
  });

  // same passwords test
  it('should mark form as valid when passwords are same', () => {
    component.form.get('password')?.setValue('Admin@1234');
    component.form.get('repeatPassword')?.setValue('Admin@1234');
    component.submit();
    expect(component.form.hasError('passwordMismatch')).toBeFalse();
  });
});
