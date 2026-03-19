import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobSearch } from './job-search';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ApiService, AuthService } from '../../services';
import { of, throwError } from 'rxjs';

describe('JobSearch', () => {
  let component: JobSearch;
  let fixture: ComponentFixture<JobSearch>;
  let apiService: jasmine.SpyObj<ApiService>;
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    apiService = jasmine.createSpyObj('ApiService', ['searchJob']);
    authService = jasmine.createSpyObj('AuthService', ['getUserToken', 'getUser']);

    authService.getUserToken.and.returnValue('token');
    authService.getUser.and.returnValue({ role: 'APPLICANT' } as any);

    apiService.searchJob.and.returnValue(
      of({ ok: true, data: [], errors: [] } as any),
    );

    await TestBed.configureTestingModule({
      imports: [JobSearch, HttpClientTestingModule, RouterTestingModule],
      providers: [
        { provide: ApiService, useValue: apiService },
        { provide: AuthService, useValue: authService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(JobSearch);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should search jobs with provided params', () => {
    const searchParams = {
      search: 'engineer',
      workType: 'FULL_TIME',
      location: 'Berlin',
      arrangement: 'REMOTE',
      salaryFrom: '50000',
      salaryTo: '70000',
    };

    component.searchJobs(searchParams);

    expect(apiService.searchJob).toHaveBeenCalledWith(searchParams);
  });

  it('should get jobs and populate jobs array on success', () => {
    const mockJobs = [
      { id: 'job1', title: 'software engineer' } as any,
      { id: 'job2', title: 'software developer' } as any,
    ];
    apiService.searchJob.and.returnValue(
      of({ ok: true, data: mockJobs, errors: [] } as any),
    );

    component.getJobs(component.defaultParams);

    expect(component.jobs).toEqual(mockJobs);
    expect(component.loading).toBeFalse();
  });
});
