import { of } from 'rxjs';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEducationModal } from './add-education-modal';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ApiService, ToastService } from '../../services';

describe('AddEducationModal', () => {
  let component: AddEducationModal;
  let fixture: ComponentFixture<AddEducationModal>;
  let apiService: jasmine.SpyObj<ApiService>;
  let toastService: jasmine.SpyObj<ToastService>;

  beforeEach(async () => {
    apiService = jasmine.createSpyObj('ApiService', ['deleteEducation', 'addOrUpdateEducation']);
    toastService = jasmine.createSpyObj('ToastService', ['show']);

    apiService.deleteEducation.and.returnValue(
      of({
        ok: true,
        data: {
          message: 'ok',
        },
        errors: [],
      }),
    );
    apiService.addOrUpdateEducation.and.returnValue(
      of({
        ok: true,
        data: {
          message: 'ok',
        },
        errors: [],
      }),
    );

    await TestBed.configureTestingModule({
      imports: [AddEducationModal, HttpClientTestingModule],
      providers: [
        { provide: ApiService, useValue: apiService },
        { provide: ToastService, useValue: toastService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AddEducationModal);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // testing form creation with empty values
  it('should initialize the form with empty values', () => {
    const form = component.form;
    expect(form).toBeDefined();
    expect(form.get('course')?.value).toBe('');
    expect(form.get('instituteName')?.value).toBe('');
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

  // calling cose modal function
  it('should emit closeModalEmitter when closeModal is called', () => {
    spyOn(component.closeModalEmitter, 'emit');

    component.closeModal();

    expect(component.closeModalEmitter.emit).toHaveBeenCalled();
  });

  it('should mark form as valid when valid values are set', () => {
    component.form.get('course')?.setValue('Software engineering');
    component.form.get('instituteName')?.setValue('University of Hildesheim');
    component.form.get('location')?.setValue('Hildesheim');
    component.form.get('startedAt')?.setValue('01/10/2025');
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
  it('should call deleteEducation API and show toast on success', () => {
    component.education = {
      id: 'abc',
      instituteName: 'institute name',
      course: 'masters',
      location: 'hildesheim',
      description: 'masters in software engineering',
      startedAt: '12/12/2025',
      endedAt: null,
      applicantId: 'abc',
    };

    apiService.deleteEducation.and.returnValue(
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

    component.deleteEducation();

    expect(apiService.deleteEducation).toHaveBeenCalledWith('abc');
    expect(toastService.show).toHaveBeenCalledWith(
      'Education Deleted',
      'Your education has been updated',
    );
    expect(component.closeModal).toHaveBeenCalled();
  });
});
