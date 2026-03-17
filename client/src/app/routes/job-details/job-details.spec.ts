import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobDetails } from './job-details';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ApiService, AuthService, ToastService } from '../../services';
import { of, throwError } from 'rxjs';
import { Location } from '@angular/common';

describe('JobDetails', () => {
  let component: JobDetails;
  let fixture: ComponentFixture<JobDetails>;
  let apiService: jasmine.SpyObj<ApiService>;
  let authService: jasmine.SpyObj<AuthService>;
  let toastService: jasmine.SpyObj<ToastService>;
  let location: jasmine.SpyObj<Location>;

  beforeEach(async () => {
    apiService = jasmine.createSpyObj('ApiService', [
      'createApplication',
      'withdrawApplication',
      'getJobApplicationByJobId',
      'getJobById',
    ]);
    authService = jasmine.createSpyObj('AuthService', ['getUserToken', 'getUser']);
    toastService = jasmine.createSpyObj('ToastService', ['show']);
    location = jasmine.createSpyObj('Location', ['back']);

    authService.getUserToken.and.returnValue('token');
    authService.getUser.and.returnValue(null);

    await TestBed.configureTestingModule({
      imports: [JobDetails, HttpClientTestingModule, RouterTestingModule],
      providers: [
        { provide: ApiService, useValue: apiService },
        { provide: AuthService, useValue: authService },
        { provide: ToastService, useValue: toastService },
        { provide: Location, useValue: location },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(JobDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should apply for job successfully when resume exists', () => {
    component.jobId = 'job1';
    component.user = { applicant: { resumeLink: 'https://example.com/resume.pdf' } } as any;
    apiService.createApplication.and.returnValue(
      of({ ok: true, data: { id: 'app1' }, errors: [] } as any),
    );
    apiService.getJobApplicationByJobId.and.returnValue(
      of({ ok: true, data: { id: 'app1' }, errors: [] } as any),
    );

    component.apply();

    expect(apiService.createApplication).toHaveBeenCalledWith('job1');
    expect(toastService.show).toHaveBeenCalledWith('Applied!', 'Your application has been made');
  });

  it('should show warning when applying without resume', () => {
    component.user = { applicant: { resumeLink: null } } as any;

    component.apply();

    expect(toastService.show).toHaveBeenCalledWith(
      'No Resume',
      'Please upload a resume from your profile before applying.',
      'warning',
    );
    expect(apiService.createApplication).not.toHaveBeenCalled();
  });

  it('should handle apply error gracefully', () => {
    component.jobId = 'job1';
    component.user = { applicant: { resumeLink: 'https://example.com/resume.pdf' } } as any;
    apiService.createApplication.and.returnValue(throwError(() => new Error('fail')));

    component.apply();

    expect(component.loading).toBeFalse();
  });

  it('should withdraw application successfully', () => {
    component.jobId = 'job1';
    component.jobApplicationId = 'app1';
    apiService.withdrawApplication.and.returnValue(
      of({ ok: true, data: {}, errors: [] } as any),
    );
    apiService.getJobApplicationByJobId.and.returnValue(
      of({ ok: true, data: { id: '' }, errors: [] } as any),
    );

    component.withdraw();

    expect(apiService.withdrawApplication).toHaveBeenCalledWith('job1');
    expect(toastService.show).toHaveBeenCalledWith(
      'Application removed',
      'Your application has been withdrawn',
    );
  });

  it('should handle withdraw error gracefully', () => {
    component.jobId = 'job1';
    apiService.withdrawApplication.and.returnValue(throwError(() => new Error('fail')));

    component.withdraw();

    expect(component.loading).toBeFalse();
  });

  it('should get job application by jobId', () => {
    component.jobId = 'job1';
    apiService.getJobApplicationByJobId.and.returnValue(
      of({ ok: true, data: { id: 'app1' }, errors: [] } as any),
    );

    component.getJobApplication();

    expect(apiService.getJobApplicationByJobId).toHaveBeenCalledWith('job1');
    expect(component.jobApplicationId).toBe('app1');
  });

  it('should clear jobApplicationId on getJobApplication error', () => {
    component.jobId = 'job1';
    component.jobApplicationId = 'app1';
    apiService.getJobApplicationByJobId.and.returnValue(throwError(() => new Error('fail')));

    component.getJobApplication();

    expect(component.jobApplicationId).toBe('');
  });

  it('should not call API if jobId is empty for getJobApplication', () => {
    component.jobId = '';

    component.getJobApplication();

    expect(apiService.getJobApplicationByJobId).not.toHaveBeenCalled();
  });

  it('should get job by jobId and format date', () => {
    component.jobId = 'job1';
    apiService.getJobById.and.returnValue(
      of({
        ok: true,
        data: { id: 'job1', createdAt: '2026-03-16T10:00:00Z' },
        errors: [],
      } as any),
    );
    spyOn(console, 'log');

    component.getJob();

    expect(apiService.getJobById).toHaveBeenCalledWith('job1');
    expect(component.job).toBeTruthy();
    expect(component.formattedDate).toBeTruthy();
  });

  it('should handle getJob error gracefully', () => {
    component.jobId = 'job1';
    apiService.getJobById.and.returnValue(throwError(() => new Error('fail')));

    component.getJob();

    expect(component.loading).toBeFalse();
  });

  it('should not call API if jobId is empty for getJob', () => {
    component.jobId = '';

    component.getJob();

    expect(apiService.getJobById).not.toHaveBeenCalled();
  });

  it('should call withdraw when changeApplicationStatus with existing applicationId', () => {
    component.jobApplicationId = 'app1';
    component.jobId = 'job1';
    apiService.withdrawApplication.and.returnValue(
      of({ ok: true, data: {}, errors: [] } as any),
    );

    spyOn(component, 'withdraw');
    component.changeApplicationStatus();

    expect(component.withdraw).toHaveBeenCalled();
  });

  it('should call apply when changeApplicationStatus without applicationId', () => {
    component.jobApplicationId = '';
    component.user = { applicant: { resumeLink: 'https://example.com/resume.pdf' } } as any;
    component.jobId = 'job1';
    apiService.createApplication.and.returnValue(
      of({ ok: true, data: { id: 'app1' }, errors: [] } as any),
    );

    spyOn(component, 'apply');
    component.changeApplicationStatus();

    expect(component.apply).toHaveBeenCalled();
  });

  it('should open and close assessment modal', () => {
    expect(component.isPopupOpen).toBeFalse();
    component.analyzeApplication();
    expect(component.isPopupOpen).toBeTrue();
    component.closeModal();
    expect(component.isPopupOpen).toBeFalse();
  });

  it('should navigate back', () => {
    component.goBack();
    expect(location.back).toHaveBeenCalled();
  });
});
