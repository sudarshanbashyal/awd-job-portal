import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSkillModal } from './add-skill-modal';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ApiService, ToastService } from '../../services';
import { of } from 'rxjs';

describe('AddSkillModal', () => {
  let component: AddSkillModal;
  let fixture: ComponentFixture<AddSkillModal>;
  let apiService: jasmine.SpyObj<ApiService>;
  let toastService: jasmine.SpyObj<ToastService>;

  beforeEach(async () => {
    apiService = jasmine.createSpyObj('ApiService', ['deleteSkill', 'addOrUpdateSkill']);
    toastService = jasmine.createSpyObj('ToastService', ['show']);

    apiService.deleteSkill.and.returnValue(
      of({
        ok: true,
        data: {
          message: 'ok',
        },
        errors: [],
      }),
    );
    apiService.addOrUpdateSkill.and.returnValue(
      of({
        ok: true,
        data: {
          message: 'ok',
        },
        errors: [],
      }),
    );

    await TestBed.configureTestingModule({
      imports: [AddSkillModal, HttpClientTestingModule],
      providers: [
        { provide: ApiService, useValue: apiService },
        { provide: ToastService, useValue: toastService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AddSkillModal);
    component = fixture.componentInstance;
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

  // test delete education api
  it('should call deleteSkill API and show toast on success', () => {
    component.skill = {
      id: 'abc',
      skill: 'Programming',
      applicantId: 'abc',
    };

    spyOn(component, 'closeModal');

    fixture.detectChanges();

    component.deleteSkill();

    expect(apiService.deleteSkill).toHaveBeenCalledWith('abc');
    expect(toastService.show).toHaveBeenCalledWith(
      'Skill removed',
      'Your skills have been updated',
    );
    expect(component.closeModal).toHaveBeenCalled();
  });
});
