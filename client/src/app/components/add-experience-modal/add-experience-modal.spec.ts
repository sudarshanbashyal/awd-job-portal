import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddExperienceModal } from './add-experience-modal';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ApiService, ToastService } from '../../services';
import { of } from 'rxjs';

describe('AddExperienceModal', () => {
  let component: AddExperienceModal;
  let fixture: ComponentFixture<AddExperienceModal>;
  let apiService: jasmine.SpyObj<ApiService>;
  let toastService: jasmine.SpyObj<ToastService>;

  beforeEach(async () => {
    apiService = jasmine.createSpyObj('ApiService', ['deleteExperience', 'addOrUpdateExperience']);
    toastService = jasmine.createSpyObj('ToastService', ['show']);

    apiService.deleteExperience.and.returnValue(
      of({
        ok: true,
        data: {
          message: 'ok',
        },
        errors: [],
      }),
    );
    apiService.addOrUpdateExperience.and.returnValue(
      of({
        ok: true,
        data: {
          message: 'ok',
        },
        errors: [],
      }),
    );

    await TestBed.configureTestingModule({
      imports: [AddExperienceModal, HttpClientTestingModule],
      providers: [
        { provide: ApiService, useValue: apiService },
        { provide: ToastService, useValue: toastService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AddExperienceModal);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // testing form creation with empty values
  it('should initialize the form with empty values', () => {
    const form = component.form;
    expect(form).toBeDefined();
    expect(form.get('role')?.value).toBe('');
    expect(form.get('companyName')?.value).toBe('');
    expect(form.get('location')?.value).toBe('');
    expect(form.get('startedAt')?.value).toBe('');
    expect(form.get('endedAt')?.value).toBe('');
    expect(form.get('description')?.value).toBe('');
  });

  // testing form with empty values
  it('should mark form as invalid if empty', () => {
    component.submit();
    expect(component.submitted).toBeTrue();
    expect(component.form.invalid).toBeTrue();
  });

  it('should emit closeModalEmitter when closeModal is called', () => {
    spyOn(component.closeModalEmitter, 'emit');

    component.closeModal();

    expect(component.closeModalEmitter.emit).toHaveBeenCalled();
  });

  // valid form
  it('should mark form as valid when valid values are set', () => {
    component.form.get('role')?.setValue('Software developer');
    component.form.get('companyName')?.setValue('Company 123');
    component.form.get('location')?.setValue('Hildesheim');
    component.form.get('startedAt')?.setValue('10/10/2025');
    component.form.get('endedAt')?.setValue('12/12/2025');
    component.form.get('description')?.setValue('Software engineering tasks...');
    component.submit();
    expect(component.form.valid).toBeTrue();
  });

  // invalid dates test
  it('should mark form as invalid when dates are incorrect', () => {
    component.form.get('startedAt')?.setValue('11/11/2025');
    component.form.get('endedAt')?.setValue('10/10/2025');
    component.submit();
    expect(component.form.hasError('dateRangeInvalid')).toBeTrue();
  });

  // test delete education api
  it('should call deleteExperience API and show toast on success', () => {
    component.experience = {
      id: 'abc',
      companyName: 'institute name',
      role: 'software engineer',
      location: 'hildesheim',
      description: 'senior software engineering',
      startedAt: '12/12/2025',
      endedAt: null,
      applicantId: 'abc',
    };

    apiService.deleteExperience.and.returnValue(
      of({
        ok: true,
        data: {
          message: 'ok',
        },
        errors: [],
      }),
    );
    spyOn(component, 'closeModal');
    fixture.detectChanges();

    component.deleteExperience();

    expect(apiService.deleteExperience).toHaveBeenCalledWith('abc');
    expect(toastService.show).toHaveBeenCalledWith(
      'Experience updated',
      'Your experience has been updated',
    );
    expect(component.closeModal).toHaveBeenCalled();
  });
});
