import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Experience } from './experience';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthService } from '../../services';

describe('Experience', () => {
  let component: Experience;
  let fixture: ComponentFixture<Experience>;
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
      imports: [Experience, HttpClientTestingModule],
      providers: [{ provide: AuthService, useValue: authService }],
    }).compileComponents();

    fixture = TestBed.createComponent(Experience);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('openmodal should open same modal for editing as well', () => {
    const experience = {
      id: 'abc',
      role: 'Software Engineer',
      companyName: 'company123',
      location: 'Hildesheim',
      startedAt: '10/10/2025',
      description: 'software engineering',
      applicantId: 'abc',
    };

    component.openModal(experience);

    expect(component.modalOpen).toBeTrue();
    expect(component.editingExperience).toBe(experience);
  });

  it('close modal shold reset editing experience', () => {
    const experience = {
      id: 'abc',
      role: 'Software Engineer',
      companyName: 'company123',
      location: 'Hildesheim',
      startedAt: '10/10/2025',
      description: 'software engineering',
      applicantId: 'abc',
    };

    component.editingExperience = experience;
    component.modalOpen = true;

    component.closeModal();

    expect(component.modalOpen).toBeFalse();
    expect(component.editingExperience).toBeNull();
    expect(authService.loadUser).toHaveBeenCalled();
  });
});
