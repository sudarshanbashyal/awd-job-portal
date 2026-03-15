import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileResume } from './profile-resume';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ApiService, AuthService, ToastService } from '../../services';
import { of } from 'rxjs';

describe('ProfileResume', () => {
  let component: ProfileResume;
  let fixture: ComponentFixture<ProfileResume>;
  let toastService: ToastService;
  let apiService: jasmine.SpyObj<ApiService>;
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    toastService = jasmine.createSpyObj('ToastService', ['show']);
    apiService = jasmine.createSpyObj('ApiService', [
      'uploadResume',
      'getResumeInfo',
      'deleteResume',
      'generateResume',
      'downloadResume',
    ]);
    authService = jasmine.createSpyObj('AuthService', ['loadUser', 'getUser', 'getProfile']);
    authService.getUser.and.returnValue(null);

    apiService.getResumeInfo.and.returnValue(
      of({
        ok: true,
        data: {
          originalName: 'test.pdf',
          size: 1234,
        },
        errors: [],
      }),
    );

    await TestBed.configureTestingModule({
      imports: [ProfileResume, HttpClientTestingModule],
      providers: [
        { provide: ToastService, useValue: toastService },
        { provide: ApiService, useValue: apiService },
        { provide: AuthService, useValue: authService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileResume);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show error when file type is invalid', () => {
    const file = new File(['test'], 'test.txt', { type: 'text/plain' });

    const event = {
      currentTarget: {
        files: [file],
      },
    } as unknown as Event;

    component.uploadResume(event);

    expect(toastService.show).toHaveBeenCalledWith(
      'Invalid file format',
      'Only pdf files are allowed',
      'error',
    );
  });

  it('should show error when file is too large', () => {
    const file = new File(['test'], 'test.pdf', { type: 'application/pdf' });

    Object.defineProperty(file, 'size', { value: 10 * 1024 * 1024 });
    fixture.detectChanges();

    const event = {
      currentTarget: {
        files: [file],
      },
    } as unknown as Event;

    component.uploadResume(event);

    expect(toastService.show).toHaveBeenCalledWith(
      'File too large',
      'The uploaded resume must be under 4MB',
      'error',
    );
  });

  it('should upload resume successfully ', () => {
    const file = new File(['test'], 'resume.pdf', { type: 'application/pdf' });

    Object.defineProperty(file, 'size', { value: 1024 });

    const event = {
      currentTarget: {
        files: [file],
      },
    } as unknown as Event;

    apiService.uploadResume.and.returnValue(
      of({
        ok: true,
        data: { message: 'success' },
        errors: [],
      }),
    );

    fixture.detectChanges();
    component.uploadResume(event);

    expect(apiService.uploadResume).toHaveBeenCalledWith(file);

    expect(toastService.show).toHaveBeenCalledWith(
      'Resume uploaded',
      'Your resume has been succesfully uploaded',
    );
  });
});
