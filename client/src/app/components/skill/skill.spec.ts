import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Skill } from './skill';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthService } from '../../services';

describe('Skill', () => {
  let component: Skill;
  let fixture: ComponentFixture<Skill>;
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    authService = jasmine.createSpyObj('AuthService', ['getUser', 'loadUser']);
    authService.getUser.and.returnValue({
      id: 'abc',
      role: 'APPLICANT' as UserType,
      email: 'testuser@gmail.com',
      applicant: {
        id: 'abc',
        userId: 'abc',
        firstName: 'test',
        lastName: 'user',
      },
    });

    await TestBed.configureTestingModule({
      imports: [Skill, HttpClientTestingModule],
      providers: [{ provide: AuthService, useValue: authService }],
    }).compileComponents();

    fixture = TestBed.createComponent(Skill);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set userProfile from authService', () => {
    expect(component.userProfile).toEqual({
      id: 'abc',
      role: 'APPLICANT' as UserType,
      email: 'testuser@gmail.com',
      applicant: {
        id: 'abc',
        userId: 'abc',
        firstName: 'test',
        lastName: 'user',
      },
    });
    expect(authService.getUser).toHaveBeenCalled();
  });

  it('openModal should open modal and set editingSkill if provided', () => {
    const skill = {
      id: 'abc',
      skill: 'programming',
    } as any;

    component.openModal(skill);

    expect(component.modalOpen).toBeTrue();
    expect(component.editingSkill).toBe(skill);
  });

  it('openModal should open modal without setting editingSkill if not provided', () => {
    component.openModal();

    expect(component.modalOpen).toBeTrue();
    expect(component.editingSkill).toBeNull();
  });

  it('closeModal should close modal, clear editingSkill, and reload user', () => {
    const skill = { id: 'abc', course: 'programming' } as any;
    component.editingSkill = skill;
    component.modalOpen = true;

    component.closeModal();

    expect(component.modalOpen).toBeFalse();
    expect(component.editingSkill).toBeNull();
    expect(authService.loadUser).toHaveBeenCalled();
  });

  it('should open modal without editing skill', () => {
    component.openModal();

    expect(component.modalOpen).toBeTrue();
    expect(component.editingSkill).toBeNull();
  });

  it('should reload user when modal closes', () => {
    component.closeModal();

    expect(authService.loadUser).toHaveBeenCalled();
  });
});
