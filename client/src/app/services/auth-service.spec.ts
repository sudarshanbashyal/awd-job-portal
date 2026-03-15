import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { ApiService } from './api.service';
import { of } from 'rxjs';

describe('AuthService', () => {
  let service: AuthService;
  let apiService: jasmine.SpyObj<ApiService>;

  const mockUser = {
    id: '123',
    email: 'test@test.com',
    role: 'APPLICANT' as UserType,
    applicant: {
      id: '123',
      userId: '123',
      firstName: 'test',
      lastName: 'user',
    },
  };

  beforeEach(() => {
    apiService = jasmine.createSpyObj('ApiService', ['getProfile']);
    apiService.getProfile.and.returnValue(of({ ok: true, data: mockUser, errors: [] }));

    TestBed.configureTestingModule({
      providers: [AuthService, { provide: ApiService, useValue: apiService }],
    });

    service = TestBed.inject(AuthService);
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should save token and load user', () => {
    spyOn(service, 'loadUser');

    service.saveUserToken('test-token');

    expect(localStorage.getItem('access-token')).toBe('test-token');
    expect(service.getUserToken()).toBe('test-token');
    expect(service.loadUser).toHaveBeenCalled();
  });

  it('should load token from localStorage when loading user', () => {
    localStorage.setItem('access-token', 'valid-token');

    spyOn(service as any, 'isTokenExpired').and.returnValue(false);

    service.loadUserToken();

    expect(service.getUserToken()).toBe('valid-token');
  });

  it('should logout if token expiered', () => {
    localStorage.setItem('access-token', 'expired-token');

    spyOn(service as any, 'isTokenExpired').and.returnValue(true);
    spyOn(service, 'logout');

    service.loadUserToken();

    expect(service.logout).toHaveBeenCalled();
    expect(service.getUserToken()).toBeNull();
  });

  it('token should be null if missing', () => {
    service.loadUserToken();
    expect(service.getUserToken()).toBeNull();
  });

  it('should be abel to get user', () => {
    service.user.set(mockUser);
    expect(service.getUser()).toEqual(mockUser);
  });

  it('should load user', () => {
    service.loadUser();

    expect(service.getUser()).toEqual(mockUser);
  });

  it('should logout correctly', () => {
    service.user.set(mockUser);
    service.token.set('token');

    service.logout();

    expect(localStorage.getItem('access-token')).toBeNull();
    expect(service.getUserToken()).toBeNull();
    expect(service.getUser()).toBeNull();
  });

  it('isTokenExpired should return true for malformed token', () => {
    const result = (service as any).isTokenExpired('invalid-token');
    expect(result).toBeTrue();
  });

  it('isTokenExpired should return false for valid future token', () => {
    const payload = {
      exp: Math.floor(Date.now() / 1000) + 60,
    };
    const token = `header.${btoa(JSON.stringify(payload))}.signature`;

    const result = (service as any).isTokenExpired(token);
    expect(result).toBeFalse();
  });

  it('isTokenExpired should return true for past token', () => {
    const payload = {
      exp: Math.floor(Date.now() / 1000) - 60,
    };
    const token = `header.${btoa(JSON.stringify(payload))}.signature`;

    const result = (service as any).isTokenExpired(token);
    expect(result).toBeTrue();
  });
});
