import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateJob } from './create-job';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ApiService, AuthService, ToastService } from '../../services';
import { of } from 'rxjs';

describe('CreateJob', () => {
  let component: CreateJob;
  let fixture: ComponentFixture<CreateJob>;
  let apiService: jasmine.SpyObj<ApiService>;
  let authService: jasmine.SpyObj<AuthService>;
  let toastService: jasmine.SpyObj<ToastService>;

  beforeEach(async () => {
    apiService = jasmine.createSpyObj('ApiService', [
      'createJob',
      'updateJob',
      'getJobPosting',
    ]);
    authService = jasmine.createSpyObj('AuthService', ['getUserToken', 'getUser']);
    toastService = jasmine.createSpyObj('ToastService', ['show']);

    authService.getUserToken.and.returnValue('token');
    authService.getUser.and.returnValue(null);

    await TestBed.configureTestingModule({
      imports: [CreateJob, HttpClientTestingModule, RouterTestingModule],
      providers: [
        { provide: ApiService, useValue: apiService },
        { provide: AuthService, useValue: authService },
        { provide: ToastService, useValue: toastService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateJob);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // testing form creation with empty values
  it('should initialize the form with empty values', () => {
    const form = component.form;
    expect(form).toBeDefined();
    expect(form.get('title')?.value).toBe('');
    expect(form.get('summary')?.value).toBe('');
    expect(form.get('description')?.value).toBe('');
    expect(form.get('location')?.value).toBe('');
    expect(form.get('jobType')?.value).toBe('');
    expect(form.get('arrangement')?.value).toBe('');
    expect(form.get('salaryFrom')?.value).toBe(null);
    expect(form.get('salaryTo')?.value).toBe(null);
  });

  // testing form with empty values
  it('should mark form as invalid if empty', () => {
    component.submit();
    expect(component.submitted).toBeTrue();
    expect(component.form.invalid).toBeTrue();
  });

  it('should mark form as valid if filled with valid vales', () => {
    apiService.createJob.and.returnValue(
      of({ ok: true, data: { id: 'job1' }, errors: [] } as any),
    );

    component.form.get('title')?.setValue('Software Engineer');
    component.form
      .get('summary')
      ?.setValue(
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec convallis quam purus, nec egestas tortor finibus eu. Maecenas vehicula eu turpis nec ultrices. Nunc congue a nunc a gravida. Ut ullamcorper lacus augue, vel pretium erat tincidunt et. Interdum et malesuada fames ac ante ipsum primis in faucibus.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec convallis quam purus, nec egestas tortor finibus eu. Maecenas vehicula eu turpis nec ultrices. Nunc congue a nunc a gravida. Ut ullamcorper lacus augue, vel pretium erat tincidunt et. Interdum et malesuada fames ac ante ipsum primis in faucibus.',
      );
    component.form
      .get('description')
      ?.setValue(
        'Nam molestie fringilla odio ut vulputate. Nulla auctor a elit eget facilisis. Nullam fermentum nunc lectus, sit amet tincidunt libero rhoncus sed. Suspendisse iaculis sollicitudin gravida. Curabitur nec lorem quam. Proin finibus justo in consequat tincidunt. Cras vulputate dictum lectus, at pharetra velit ultricies ullamcorper. Praesent dignissim egestas efficitur. Proin aliquam, sem rutrum dignissim pharetra, dui libero posuere purus, in molestie arcu quam ut urna. Curabitur sit amet mi nec ipsum tempor semper ac eget ligula. Aenean urna metus, luctus eget viverra et, euismod sit amet mauris. Mauris rhoncus massa eros, at viverra eros mollis nec. Maecenas porttitor ligula vitae ex semper interdum.Nam molestie fringilla odio ut vulputate. Nulla auctor a elit eget facilisis. Nullam fermentum nunc lectus, sit amet tincidunt libero rhoncus sed. Suspendisse iaculis sollicitudin gravida. Curabitur nec lorem quam. Proin finibus justo in consequat tincidunt. Cras vulputate dictum lectus, at pharetra velit ultricies ullamcorper. Praesent dignissim egestas efficitur. Proin aliquam, sem rutrum dignissim pharetra, dui libero posuere purus, in molestie arcu quam ut urna. Curabitur sit amet mi nec ipsum tempor semper ac eget ligula. Aenean urna metus, luctus eget viverra et, euismod sit amet mauris. Mauris rhoncus massa eros, at viverra eros mollis nec. Maecenas porttitor ligula vitae ex semper interdum.',
      );
    component.form.get('location')?.setValue('Hildesheim');
    component.form.get('jobType')?.setValue('FULL_TIME');
    component.form.get('arrangement')?.setValue('REMOTE');
    component.submit();
    expect(component.form.valid).toBeTrue();
  });

  // testing with valid and invalid salary Ranges
  it('should mark form as invalid when invalid salary range is entered', () => {
    component.form.get('salaryFrom')?.setValue(50000);
    component.form.get('salaryTo')?.setValue(40000);
    component.submit();
    expect(component.form.hasError('invalidSalary')).toBeTrue();
  });

  it('should mark form as valid when valid salary range is entered', () => {
    component.form.get('salaryFrom')?.setValue(40000);
    component.form.get('salaryTo')?.setValue(50000);
    component.submit();
    expect(component.form.hasError('invalidSalary')).toBeFalse();
  });

  it('should create job successfully when form is valid and no previous job', () => {
    apiService.createJob.and.returnValue(
      of({ ok: true, data: { id: 'job1' }, errors: [] } as any),
    );

    component.form.get('title')?.setValue('Software Engineer');
    component.form.get('summary')?.setValue('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec convallis quam purus, nec egestas tortor finibus eu. Maecenas vehicula eu turpis nec ultrices. Nunc congue a nunc a gravida. Ut ullamcorper lacus augue, vel pretium erat tincidunt et. Interdum et malesuada fames ac ante ipsum primis in faucibus.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec convallis quam purus, nec egestas tortor finibus eu. Maecenas vehicula eu turpis nec ultrices. Nunc congue a nunc a gravida. Ut ullamcorper lacus augue, vel pretium erat tincidunt et. Interdum et malesuada fames ac ante ipsum primis in faucibus.');
    component.form.get('description')?.setValue('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec convallis quam purus, nec egestas tortor finibus eu. Maecenas vehicula eu turpis nec ultrices. Nunc congue a nunc a gravida. Ut ullamcorper lacus augue, vel pretium erat tincidunt et. Interdum et malesuada fames ac ante ipsum primis in faucibus.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec convallis quam purus, nec egestas tortor finibus eu. Maecenas vehicula eu turpis nec ultrices. Nunc congue a nunc a gravida. Ut ullamcorper lacus augue, vel pretium erat tincidunt et. Interdum et malesuada fames ac ante ipsum primis in faucibus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec convallis quam purus, nec egestas tortor finibus eu. Maecenas vehicula eu turpis nec ultrices. Nunc congue a nunc a gravida. Ut ullamcorper lacus augue, vel pretium erat tincidunt et. Interdum et malesuada fames ac ante ipsum primis in faucibus.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec convallis quam purus, nec egestas tortor finibus eu. Maecenas vehicula eu turpis nec ultrices. Nunc congue a nunc a gravida. Ut ullamcorper lacus augue, vel pretium erat tincidunt et. Interdum et malesuada fames ac ante ipsum primis in faucibus.');
    component.form.get('location')?.setValue('Hildesheim');
    component.form.get('jobType')?.setValue('FULL_TIME');
    component.form.get('arrangement')?.setValue('REMOTE');
    component.previousJob = null;

    component.submit();

    expect(apiService.createJob).toHaveBeenCalled();
    expect(toastService.show).toHaveBeenCalledWith('Job Posted', 'A new job has been created!');
  });

  it('should update job when previousJob exists', () => {
    component.previousJob = { id: 'job1', status: 'OPEN' } as any;
    apiService.updateJob.and.returnValue(
      of({ ok: true, data: {}, errors: [] } as any),
    );
    apiService.getJobPosting.and.returnValue(
      of({ ok: true, data: { id: 'job1' }, errors: [] } as any),
    );

    component.form.get('title')?.setValue('Software Engineer');
    component.form.get('summary')?.setValue('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec convallis quam purus, nec egestas tortor finibus eu. Maecenas vehicula eu turpis nec ultrices. Nunc congue a nunc a gravida. Ut ullamcorper lacus augue, vel pretium erat tincidunt et. Interdum et malesuada fames ac ante ipsum primis in faucibus.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec convallis quam purus, nec egestas tortor finibus eu. Maecenas vehicula eu turpis nec ultrices. Nunc congue a nunc a gravida. Ut ullamcorper lacus augue, vel pretium erat tincidunt et. Interdum et malesuada fames ac ante ipsum primis in faucibus.');
    component.form.get('description')?.setValue('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec convallis quam purus, nec egestas tortor finibus eu. Maecenas vehicula eu turpis nec ultrices. Nunc congue a nunc a gravida. Ut ullamcorper lacus augue, vel pretium erat tincidunt et. Interdum et malesuada fames ac ante ipsum primis in faucibus.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec convallis quam purus, nec egestas tortor finibus eu. Maecenas vehicula eu turpis nec ultrices. Nunc congue a nunc a gravida. Ut ullamcorper lacus augue, vel pretium erat tincidunt et. Interdum et malesuada fames ac ante ipsum primis in faucibus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec convallis quam purus, nec egestas tortor finibus eu. Maecenas vehicula eu turpis nec ultrices. Nunc congue a nunc a gravida. Ut ullamcorper lacus augue, vel pretium erat tincidunt et. Interdum et malesuada fames ac ante ipsum primis in faucibus.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec convallis quam purus, nec egestas tortor finibus eu. Maecenas vehicula eu turpis nec ultrices. Nunc congue a nunc a gravida. Ut ullamcorper lacus augue, vel pretium erat tincidunt et. Interdum et malesuada fames ac ante ipsum primis in faucibus.');
    component.form.get('location')?.setValue('Hildesheim');
    component.form.get('jobType')?.setValue('FULL_TIME');
    component.form.get('arrangement')?.setValue('REMOTE');

    component.submit();

    expect(apiService.updateJob).toHaveBeenCalled();
    expect(toastService.show).toHaveBeenCalledWith('Job Updated', 'Your job has been updated');
  });

  it('should toggle job status from OPEN to CLOSED', () => {
    component.previousJob = { id: 'job1', status: 'OPEN' } as any;
    apiService.updateJob.and.returnValue(
      of({ ok: true, data: {}, errors: [] } as any),
    );
    apiService.getJobPosting.and.returnValue(
      of({ ok: true, data: { id: 'job1' }, errors: [] } as any),
    );

    component.updateJobStatus();

    expect(apiService.updateJob).toHaveBeenCalledWith('job1', jasmine.objectContaining({ status: 'CLOSED' }));
  });

  it('should toggle job status from CLOSED to OPEN', () => {
    component.previousJob = { id: 'job1', status: 'CLOSED' } as any;
    apiService.updateJob.and.returnValue(
      of({ ok: true, data: {}, errors: [] } as any),
    );
    apiService.getJobPosting.and.returnValue(
      of({ ok: true, data: { id: 'job1' }, errors: [] } as any),
    );

    component.updateJobStatus();

    expect(apiService.updateJob).toHaveBeenCalledWith('job1', jasmine.objectContaining({ status: 'OPEN' }));
  });

 it('should not create job if already loading', () => {
    component.loading = true;

    component.form.get('title')?.setValue('Software Engineer');
    component.form.get('summary')?.setValue('A' + ' a'.repeat(50));
    component.form.get('description')?.setValue('B' + ' b'.repeat(100));
    component.form.get('location')?.setValue('Hildesheim');
    component.form.get('jobType')?.setValue('FULL_TIME');
    component.form.get('arrangement')?.setValue('REMOTE');

    component.submit();

    expect(apiService.createJob).not.toHaveBeenCalled();
  });

  it('should get job and populate form', () => {
    component.jobId = 'job1';
    const testJob = {
      id: 'job1',
      title: 'Software Engineer',
      summary: 'A' + ' a'.repeat(50),
      description: 'B' + ' b'.repeat(100),
      location: 'Hildesheim',
      jobType: 'FULL_TIME',
      arrangement: 'REMOTE',
    } as any;
    apiService.getJobPosting.and.returnValue(
      of({ ok: true, data: testJob, errors: [] } as any),
    );

    component.getJob();

    expect(apiService.getJobPosting).toHaveBeenCalledWith('job1');
    expect(component.previousJob).toBeTruthy();
    expect(component.form.get('title')?.value).toBe('Software Engineer');
  });



  it('should not update job status if no previousJob', () => {
    component.previousJob = null;

    component.updateJobStatus();

    expect(apiService.updateJob).not.toHaveBeenCalled();
  });

  it('should not call API if jobId is empty for getJob', () => {
    component.jobId = '';

    component.getJob();

    expect(apiService.getJobPosting).not.toHaveBeenCalled();
  });
});