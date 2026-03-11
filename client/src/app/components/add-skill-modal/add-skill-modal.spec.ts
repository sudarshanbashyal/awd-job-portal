import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSkillModal } from './add-skill-modal';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AddSkillModal', () => {
  let component: AddSkillModal;
  let fixture: ComponentFixture<AddSkillModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddSkillModal, HttpClientTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(AddSkillModal);
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
    expect(form.get('skill')?.value).toBe('');
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
    component.form.get('skill')?.setValue('Programming');
    component.submit();
    expect(component.form.valid).toBeTrue();
  });
});
