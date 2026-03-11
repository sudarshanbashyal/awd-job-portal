import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileHeader } from './profile-header';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ApiService, AuthService, ToastService } from '../../services';
import { of } from 'rxjs';

describe('ProfileHeader', () => {
  let component: ProfileHeader;
  let fixture: ComponentFixture<ProfileHeader>;
  let toastService: ToastService;
  let apiService: jasmine.SpyObj<ApiService>;
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    toastService = jasmine.createSpyObj('ToastService', ['show']);
    apiService = jasmine.createSpyObj('ApiService', [
      'uploadProfilePicture',
      'loadUser',
      'getProfile',
    ]);
    authService = jasmine.createSpyObj('AuthService', ['loadUser']);

    await TestBed.configureTestingModule({
      imports: [ProfileHeader, HttpClientTestingModule],
      providers: [
        { provide: ToastService, useValue: toastService },
        { provide: ApiService, useValue: apiService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileHeader);
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

    component.uploadProfile(event);

    expect(toastService.show).toHaveBeenCalledWith(
      'Invalid file format',
      'Only png and jpeg are allowed',
      'error',
    );
  });

  it('should show error when file is too large', () => {
    const file = new File(['test'], 'test.png', { type: 'image/png' });

    Object.defineProperty(file, 'size', { value: 10 * 1024 * 1024 });

    const event = {
      currentTarget: {
        files: [file],
      },
    } as unknown as Event;

    component.uploadProfile(event);

    expect(toastService.show).toHaveBeenCalledWith(
      'File too large',
      'The uploaded picture must be under 4MB',
      'error',
    );
  });
});
