import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileResume } from './profile-resume';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ApiService, AuthService, ToastService } from '../../services';
import { of, throwError } from 'rxjs';

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

  it('should set resumeInfo to null when no originalName returned', () => {
    apiService.getResumeInfo.and.returnValue(
      of({ ok: true, data: { size: 123 }, errors: [] } as any),
    );

    component.loadResumeInfo();

    expect(component.resumeInfo).toBeNull();
  });

  it('should download resume and revoke url on success', () => {
    const blob = new Blob(['abc'], { type: 'application/pdf' });
    apiService.downloadResume.and.returnValue(of(blob));

    spyOn(window.URL, 'createObjectURL').and.returnValue('blob:fake');
    spyOn(window.URL, 'revokeObjectURL').and.callFake(() => {});
    spyOn(HTMLAnchorElement.prototype, 'click').and.callFake(() => {});

    component.resumeInfo = { originalName: 'file.pdf', size: 10 } as any;

    component.downloadResume();

    expect(apiService.downloadResume).toHaveBeenCalled();
    expect(window.URL.createObjectURL).toHaveBeenCalled();
    expect(HTMLAnchorElement.prototype.click).toHaveBeenCalled();
    expect(window.URL.revokeObjectURL).toHaveBeenCalled();
  });

  it('should handle download error without throwing', () => {
    apiService.downloadResume.and.returnValue(throwError(() => new Error('fail')));
    spyOn(console, 'error');

    component.downloadResume();

    expect(apiService.downloadResume).toHaveBeenCalled();
    expect(console.error).toHaveBeenCalled();
  });

  it('should warn when generating resume without skills or education', () => {
    authService.getUser.and.returnValue({ applicant: { skills: [], education: [] } } as any);

    component.generateResume();

    expect(toastService.show).toHaveBeenCalledWith(
      'Cannot generate resume.',
      'Please add skills and education first.',
      'warning',
    );
  });

  it('should generate resume and refresh user on success', () => {
  // set component.user directly so the method sees skills/education
  component.user = { applicant: { skills: ['s'], education: ['e'] } } as any;
  apiService.generateResume.and.returnValue(of({ ok: true } as any));

  component.generateResume();

    expect(apiService.generateResume).toHaveBeenCalled();
    expect(authService.loadUser).toHaveBeenCalled();
    expect(toastService.show).toHaveBeenCalledWith(
      'Resume generated',
      'A new resume has been generated based on your profile.',
    );
  });

  it('should delete resume and refresh user on success', () => {
    apiService.deleteResume.and.returnValue(of({ ok: true } as any));

    component.deleteResume();

    expect(apiService.deleteResume).toHaveBeenCalled();
    expect(authService.loadUser).toHaveBeenCalled();
    expect(toastService.show).toHaveBeenCalledWith('Resume deleted', 'Your resume has been removed.');
  });
});
