import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssessmentModal } from './assessment-modal';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ApiService, AuthService } from '../../services';
import { of, throwError } from 'rxjs';

describe('AssessmentModal', () => {
  let component: AssessmentModal;
  let fixture: ComponentFixture<AssessmentModal>;
  let apiService: jasmine.SpyObj<ApiService>;
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    apiService = jasmine.createSpyObj('ApiService', [
      'streamApplicationAssessment',
      'disconnectAssessmentStream',
    ]);
    authService = jasmine.createSpyObj('AuthService', ['loadUser', 'getUserToken']);

    await TestBed.configureTestingModule({
      imports: [AssessmentModal, HttpClientTestingModule],
      providers: [
        { provide: ApiService, useValue: apiService },
        { provide: AuthService, useValue: authService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AssessmentModal);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit closeModalEmitter when closeModal is called', () => {
    spyOn(component.closeModalEmitter, 'emit');

    component.closeModal();

    expect(component.closeModalEmitter.emit).toHaveBeenCalled();
  });

  it('should set token from authService and call assessApplication if jobId exists', () => {
    authService.getUserToken.and.returnValue('token123');
    component.jobId = 'abc';

    apiService.streamApplicationAssessment.and.returnValue(of({ done: false, progress: 50 }));

    fixture.detectChanges();

    expect(component.token).toBe('token123');
    expect(apiService.streamApplicationAssessment).toHaveBeenCalledWith('abc', 'Bearer token123');
  });

  it('should update assessmentProgress when data.done is false', () => {
    component.jobId = 'abc';
    component.token = 'token123';
    apiService.streamApplicationAssessment.and.returnValue(of({ done: false, progress: 30 }));

    component.assessApplication();

    expect(component.assessmentProgress).toBe(30);
    expect(component.applicationAssessment).toBeNull();
  });

  it('should update applicationAssessment when data.done is true', () => {
    const assessment = { rating: 10, summary: 'good', suggestedImprovements: [] } as any;
    component.jobId = 'abc';
    component.token = 'token123';
    component.applicationAssessment = assessment;
    apiService.streamApplicationAssessment.and.returnValue(of(assessment));

    component.assessApplication();

    expect(component.applicationAssessment).toEqual(assessment);
    expect(component.assessmentLoading).toBeFalse();
  });

  it('should set assessmentFailed to true on error if no assessment exists', () => {
    component.jobId = 'job1';
    component.token = 'token123';
    apiService.streamApplicationAssessment.and.returnValue(throwError(() => new Error('fail')));

    component.assessApplication();

    expect(component.assessmentFailed).toBeTrue();
  });

  it('should not set assessmentFailed if an assessment already exists', () => {
    component.jobId = 'job1';
    component.token = 'token123';
    component.applicationAssessment = { score: 80 } as any;
    apiService.streamApplicationAssessment.and.returnValue(throwError(() => new Error('fail')));

    component.assessApplication();

    expect(component.assessmentFailed).toBeFalse();
  });

  it('assessApplication should not run if already loading or missing token/jobId', () => {
    component.assessmentLoading = true;
    component.jobId = 'job1';
    component.token = 'token123';

    component.assessApplication();
    expect(apiService.streamApplicationAssessment).not.toHaveBeenCalled();

    component.assessmentLoading = false;
    component.jobId = '';
    component.assessApplication();
    expect(apiService.streamApplicationAssessment).not.toHaveBeenCalled();

    component.jobId = 'job1';
    component.token = '';
    component.assessApplication();
    expect(apiService.streamApplicationAssessment).not.toHaveBeenCalled();
  });
});
