import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Navbar } from './navbar';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthService, ToastService } from '../../services';
import { RouterTestingModule } from '@angular/router/testing';

describe('Navbar', () => {
  let component: Navbar;
  let fixture: ComponentFixture<Navbar>;
  let authService: jasmine.SpyObj<AuthService>;
  let toastService: jasmine.SpyObj<ToastService>;

  beforeEach(async () => {
    authService = jasmine.createSpyObj('AuthService', ['getUser', 'logout']);
    toastService = jasmine.createSpyObj('ToastService', ['show']);

    await TestBed.configureTestingModule({
      imports: [Navbar, HttpClientTestingModule, RouterTestingModule],
      providers: [
        {
          provide: AuthService,
          useValue: authService,
        },
        {
          provide: ToastService,
          useValue: toastService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Navbar);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set isAuth false when no user exists', () => {
    authService.getUser.and.returnValue(null);

    fixture.detectChanges();

    expect(component.user).toBeNull();
    expect(component.isAuth).toBeFalse();
  });

  it('should logout and show toast', () => {
    fixture.detectChanges();

    component.logout();

    expect(authService.logout).toHaveBeenCalled();
    expect(toastService.show).toHaveBeenCalledWith(
      'Logged out',
      'You have been logged out of the session',
    );
  });

  it('should have applicant routes when user is applicant', () => {
    const user = {
      id: '1',
      applicant: { id: 'a1' },
      recruiter: null,
    } as any;

    authService.getUser.and.returnValue(user);

    fixture.detectChanges();

    expect(component.user).toEqual(user);
    expect(component.isAuth).toBeTrue();
    expect(component.applicantRoutes).toEqual([
      { link: '/search', name: 'Home' },
      { link: '/job-application', name: 'My Applications' },
    ]);
  });

  it('should have recruiter routes when user is recruiter', () => {
    const mockUser = {
      id: '1',
      applicant: null,
      recruiter: { id: 'r1' },
    } as any;

    authService.getUser.and.returnValue(mockUser);

    fixture.detectChanges();

    expect(component.user).toEqual(mockUser);
    expect(component.isAuth).toBeTrue();
    expect(component.recruiterRoutes).toEqual([
      { link: '/job-listings', name: 'Home' },
      { link: '/job-post', name: 'Add Job' },
    ]);
  });
});
