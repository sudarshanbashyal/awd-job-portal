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

  it('should handle SSE stream and include done', (done) => {
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

  it('should propagate SSE errors', (done) => {
    const fakeEventSource: any = {
      onmessage: null,
      onerror: null,
      close: jasmine.createSpy('close'),
    };

    spyOn(window as any, 'EventSource').and.returnValue(fakeEventSource);

    zone.run(() => {
      service.streamApplicationAssessment('job123', 'token123').subscribe({
        next: () => {},
        error: (err) => {
          expect(err).toBe('boom');
          done();
        },
      });

      fakeEventSource.onerror('boom');
    });
  });

  it('should disconnect SSE stream', () => {
    const fakeEventSource = { close: jasmine.createSpy('close') };
    (service as any).eventSource = fakeEventSource;

    service.disconnectAssessmentStream();

    expect(fakeEventSource.close).toHaveBeenCalled();
    expect((service as any).eventSource).toBeUndefined();
  });
});
