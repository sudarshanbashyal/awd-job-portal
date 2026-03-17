import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobApplication } from './job-application';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ApiService, AuthService } from '../../services';
import { of, throwError } from 'rxjs';

describe('JobApplication', () => {
  let component: JobApplication;
  let fixture: ComponentFixture<JobApplication>;
  let apiService: jasmine.SpyObj<ApiService>;
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    apiService = jasmine.createSpyObj('ApiService', ['getMyApplications']);
    authService = jasmine.createSpyObj('AuthService', ['getUserToken', 'getUser']);

    authService.getUserToken.and.returnValue('token');
    authService.getUser.and.returnValue({ role: 'APPLICANT' } as any);

    apiService.getMyApplications.and.returnValue(
      of({ data: [], errors: [] } as any),
    );

    await TestBed.configureTestingModule({
      imports: [JobApplication, HttpClientTestingModule, RouterTestingModule],
      providers: [
        { provide: ApiService, useValue: apiService },
        { provide: AuthService, useValue: authService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(JobApplication);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch applications on init', () => {
    component.ngOnInit();

    expect(apiService.getMyApplications).toHaveBeenCalled();
  });

  it('should populate applications array on successful fetch', () => {
    const mockApplications = [
      { id: 'app1', jobId: 'job1', status: 'APPLIED' },
      { id: 'app2', jobId: 'job2', status: 'SHORTLISTED' },
    ];
    apiService.getMyApplications.and.returnValue(
      of({ data: mockApplications, errors: [] } as any),
    );
    spyOn(console, 'log');

    component.ngOnInit();

    expect(component.applications).toEqual(mockApplications);
    expect(console.log).toHaveBeenCalledWith('Applications:', jasmine.any(Object));
    expect(console.log).toHaveBeenCalledWith('Assigned applications:', mockApplications);
  });

  it('should handle fetch error gracefully', () => {
    apiService.getMyApplications.and.returnValue(throwError(() => new Error('fail')));
    spyOn(console, 'error');

    component.ngOnInit();

    expect(console.error).toHaveBeenCalledWith('Error fetching applications:', jasmine.any(Error));
  });

  it('should set empty array if data is null', () => {
    apiService.getMyApplications.and.returnValue(
      of({ data: null, errors: [] } as any),
    );

    component.ngOnInit();

    expect(component.applications).toEqual([]);
  });
});
