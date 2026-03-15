import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Education } from './education';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthService } from '../../services';

describe('Education', () => {
  let component: Education;
  let fixture: ComponentFixture<Education>;
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
      imports: [Education, HttpClientTestingModule],
      providers: [{ provide: AuthService, useValue: authService }],
    }).compileComponents();

    fixture = TestBed.createComponent(Education);
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

  it('openModal should open modal and set editingEducation if provided', () => {
    const education = {
      id: 'abc',
      course: 'software engineering',
      instituteName: 'university of hildesheim',
      location: 'hildesheim',
    } as any;

    component.openModal(education);

    expect(component.modalOpen).toBeTrue();
    expect(component.editingEducation).toBe(education);
  });

  it('openModal should open modal without setting editingEducation if not provided', () => {
    component.openModal();

    expect(component.modalOpen).toBeTrue();
    expect(component.editingEducation).toBeNull();
  });

  it('closeModal should close modal, clear editingEducation, and reload user', () => {
    const education = { id: 'abc', course: 'software engineering' } as any;
    component.editingEducation = education;
    component.modalOpen = true;

    component.closeModal();

    expect(component.modalOpen).toBeFalse();
    expect(component.editingEducation).toBeNull();
    expect(authService.loadUser).toHaveBeenCalled();
  });
});
