import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEducationModal } from './add-education-modal';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AddEducationModal', () => {
  let component: AddEducationModal;
  let fixture: ComponentFixture<AddEducationModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEducationModal, HttpClientTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(AddEducationModal);
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
});
