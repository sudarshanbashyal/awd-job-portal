import { TestBed } from '@angular/core/testing';
import { ApiService } from './api.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { NgZone } from '@angular/core';
import { environment } from '../environments/environment';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;
  let zone: NgZone;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiService],
    });

    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
    zone = TestBed.inject(NgZone);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call login with correct URL and body', () => {
    const credentials = { email: 'a', password: 'b' };
    service.login(credentials).subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(credentials);
    req.flush({});
  });

  it('should call register', () => {
    const payload = {
      email: 'testuser@gmail.com',
      password: 'abcdef',
      role: 'APPLICANT',
      firstName: 'test',
      lastName: 'user',
    };
    service.register(payload).subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/register`);
    expect(req.request.method).toBe('POST');
    req.flush({});
  });

  it('should call getProfile', () => {
    service.getProfile().subscribe();
    const req = httpMock.expectOne(`${environment.apiUrl}/profile`);
    expect(req.request.method).toBe('GET');
    req.flush({});
  });

  it('should updateRecruiterProfile', () => {
    const payload = {
      firstName: 'test',
      lastName: 'user',
      companyName: 'test company',
      companyAddress: 'hildesheim',
    };
    service.updateRecruiterProfile(payload).subscribe();
    const req = httpMock.expectOne(`${environment.apiUrl}/recruiter-profile`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual(payload);
    req.flush({});
  });

  it('should addOrUpdateSkill with FormData-like object', () => {
    const payload = { name: 'Angular' };
    service.addOrUpdateSkill(payload as any).subscribe();
    const req = httpMock.expectOne(`${environment.apiUrl}/skills`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body.skills[0]).toEqual(payload);
    req.flush({});
  });

  it('should call deleteSkill', () => {
    service.deleteSkill('123').subscribe();
    const req = httpMock.expectOne(`${environment.apiUrl}/skill/123`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

  it('should call uploadResume with FormData', () => {
    const file = new File(['test'], 'resume.pdf', { type: 'application/pdf' });
    service.uploadResume(file).subscribe();
    const req = httpMock.expectOne(`${environment.apiUrl}/resume`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body.has('file')).toBeTrue();
    req.flush({});
  });

  it('should call generateToken', () => {
    service.generateToken({ email: 'testuser@gmail.com' }).subscribe();
    const req = httpMock.expectOne(`${environment.apiUrl}/auth/reset-token`);
    expect(req.request.method).toBe('POST');
    req.flush({});
  });

  it('should call verifyToken', () => {
    service.verifyToken({ email: 'testuser@gmail.com', token: '123' }).subscribe();
    const req = httpMock.expectOne(`${environment.apiUrl}/auth/verify-token`);
    expect(req.request.method).toBe('POST');
    req.flush({});
  });

  it('should call resetPassword', () => {
    service
      .resetPassword({ email: 'testuser@gmail.com', token: '123', password: '12345678' })
      .subscribe();
    const req = httpMock.expectOne(`${environment.apiUrl}/auth/reset-password`);
    expect(req.request.method).toBe('PATCH');
    req.flush({});
  });

  it('should call updateApplicantProfile', () => {
    service
      .updateApplicantProfile({
        firstName: 'test',
        lastName: 'user',
        location: null,
        phoneNumber: null,
        profile: null,
      })
      .subscribe();
    const req = httpMock.expectOne(`${environment.apiUrl}/applicant-profile`);
    expect(req.request.method).toBe('PATCH');
    req.flush({});
  });

  it('should call updateRecruiterProfile', () => {
    service
      .updateRecruiterProfile({
        firstName: 'test',
        lastName: 'user',
        companyName: 'abc',
        companyAddress: 'hildesheim',
      })
      .subscribe();
    const req = httpMock.expectOne(`${environment.apiUrl}/recruiter-profile`);
    expect(req.request.method).toBe('PATCH');
    req.flush({});
  });

  it('should call deleteAccount', () => {
    service.deleteAccount().subscribe();
    const req = httpMock.expectOne(`${environment.apiUrl}/account`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

  it('should call addOrUpdateExperience', () => {
    service
      .addOrUpdateExperience({
        role: 'software engineer',
        companyName: 'abcd',
        location: 'hildesheim',
        startedAt: '01/01/2025',
        endedAt: null,
        description: 'software engineer',
        applicantId: '123',
      })
      .subscribe();
    const req = httpMock.expectOne(`${environment.apiUrl}/experience`);
    expect(req.request.method).toBe('PUT');
    req.flush({});
  });

  it('should call addOrUpdateEducation', () => {
    service
      .addOrUpdateEducation({
        instituteName: 'abcd',
        course: 'software engineering',
        location: 'hildesheim',
        startedAt: '01/01/2025',
        endedAt: null,
        description: 'masters in software engineering',
        applicantId: '123',
      })
      .subscribe();
    const req = httpMock.expectOne(`${environment.apiUrl}/education`);
    expect(req.request.method).toBe('PUT');
    req.flush({});
  });

  it('should call addOrUpdateSkill', () => {
    service
      .addOrUpdateSkill({
        skill: 'angular',
      })
      .subscribe();
    const req = httpMock.expectOne(`${environment.apiUrl}/skills`);
    expect(req.request.method).toBe('PUT');
    req.flush({});
  });

  it('should call deleteExperience', () => {
    service.deleteExperience('123').subscribe();
    const req = httpMock.expectOne(`${environment.apiUrl}/experience/123`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

  it('should call deleteEducation', () => {
    service.deleteEducation('123').subscribe();
    const req = httpMock.expectOne(`${environment.apiUrl}/education/123`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

  it('should call deleteSkill', () => {
    service.deleteSkill('123').subscribe();
    const req = httpMock.expectOne(`${environment.apiUrl}/skill/123`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

  it('should call getResumeInfo', () => {
    service.getResumeInfo().subscribe();
    const req = httpMock.expectOne(`${environment.apiUrl}/resume-info`);
    expect(req.request.method).toBe('GET');
    req.flush({});
  });

  it('should call downloadResume', () => {
    service.getResumeInfo().subscribe();
    const req = httpMock.expectOne(`${environment.apiUrl}/resume-info`);
    expect(req.request.method).toBe('GET');
    req.flush({});
  });

  it('should call generateResume', () => {
    service.generateResume().subscribe();
    const req = httpMock.expectOne(`${environment.apiUrl}/generate-resume`);
    expect(req.request.method).toBe('POST');
    req.flush({});
  });

  it('should call deleteResume', () => {
    service.deleteResume().subscribe();
    const req = httpMock.expectOne(`${environment.apiUrl}/resume`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

  it('should call uploadProfilePicture', () => {
    const file = new File(['test'], 'profile.png', { type: 'image/png' });
    service.uploadProfilePicture(file).subscribe();
    const req = httpMock.expectOne(`${environment.apiUrl}/profile-picture`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body.has('file')).toBeTrue();
    req.flush({});
  });

  it('should call getJobPostings', () => {
    service.getJobPostings({ search: 'job', status: 'OPEN' }).subscribe();
    const req = httpMock.expectOne(`${environment.apiUrl}/my-jobs?search=job&status=OPEN`);
    expect(req.request.method).toBe('GET');
    req.flush({});
  });

  it('should call createJob', () => {
    service
      .createJob({
        title: 'software engineer',
        summary: 'summary 123',
        description: 'description 123',
        location: 'hildesheim',
        jobType: 'FULL_TIME',
        arrangement: 'REMOTE',
        salaryFrom: null,
        salaryTo: null,
        status: 'OPEN',
      })
      .subscribe();
    const req = httpMock.expectOne(`${environment.apiUrl}/create-job`);
    expect(req.request.method).toBe('POST');
    req.flush({});
  });

  it('should call getJobPosting', () => {
    service.getJobPosting('123').subscribe();
    const req = httpMock.expectOne(`${environment.apiUrl}/job-posting/123`);
    expect(req.request.method).toBe('GET');
    req.flush({});
  });

  it('should call updateJob', () => {
    service
      .updateJob('123', {
        title: 'software engineer',
        summary: 'summary 123',
        description: 'description 123',
        location: 'hildesheim',
        jobType: 'FULL_TIME',
        arrangement: 'REMOTE',
        salaryFrom: null,
        salaryTo: null,
        status: 'OPEN',
      })
      .subscribe();
    const req = httpMock.expectOne(`${environment.apiUrl}/update-job/123`);
    expect(req.request.method).toBe('PATCH');
    req.flush({});
  });

  it('should call searchJob', () => {
    service
      .searchJob({
        search: 'job',
        workType: '',
        location: '',
        arrangement: 'HYBRID',
        salaryFrom: '12000',
        salaryTo: '15000',
      })
      .subscribe();
    const req = httpMock.expectOne(
      `${environment.apiUrl}/search?search=job&workType=&location=&arrangement=HYBRID&salaryFrom=12000&salaryTo=15000`,
    );
    expect(req.request.method).toBe('GET');
    req.flush({});
  });

  it('should call getJobById', () => {
    service.getJobById('123').subscribe();
    const req = httpMock.expectOne(`${environment.apiUrl}/job/123`);
    expect(req.request.method).toBe('GET');
    req.flush({});
  });

  it('should call getJobApplicationByJobId', () => {
    service.getJobApplicationByJobId('123').subscribe();
    const req = httpMock.expectOne(`${environment.apiUrl}/my-application/123`);
    expect(req.request.method).toBe('GET');
    req.flush({});
  });

  it('should call createApplication', () => {
    service.createApplication('123').subscribe();
    const req = httpMock.expectOne(`${environment.apiUrl}/apply/123`);
    expect(req.request.method).toBe('POST');
    req.flush({});
  });

  it('should call withdrawApplication', () => {
    service.withdrawApplication('123').subscribe();
    const req = httpMock.expectOne(`${environment.apiUrl}/withdraw/123`);
    expect(req.request.method).toBe('PATCH');
    req.flush({});
  });

  it('should call getMyApplications', () => {
    service.getMyApplications().subscribe();
    const req = httpMock.expectOne(`${environment.apiUrl}/my-applications`);
    expect(req.request.method).toBe('GET');
    req.flush({});
  });

  it('should be able to listen to sse events for assessment', (done) => {
    const fakeEventSource: any = {
      onmessage: null,
      onerror: null,
      close: jasmine.createSpy('close'),
    };

    spyOn(window as any, 'EventSource').and.returnValue(fakeEventSource);

    zone.run(() => {
      const observable = service.streamApplicationAssessment('job123', 'token123');

      const subscription = observable.subscribe({
        next: (data) => {
          try {
            expect(data).toEqual({ progress: 50, done: false });
            subscription.unsubscribe();
            done();
          } catch (err) {
            done.fail(err as Error);
          }
        },
        error: (err) => done.fail(err),
      });

      fakeEventSource.onmessage({
        data: JSON.stringify({ progress: 50, done: false }),
      } as MessageEvent);
    });
  });
});
