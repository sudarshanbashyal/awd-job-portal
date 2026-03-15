import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteAccount } from './delete-account';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ApiService, AuthService, ToastService } from '../../services';
import { of, throwError } from 'rxjs';

describe('DeleteAccount', () => {
  let component: DeleteAccount;
  let fixture: ComponentFixture<DeleteAccount>;
  let apiService: jasmine.SpyObj<ApiService>;
  let authService: jasmine.SpyObj<AuthService>;
  let toastService: jasmine.SpyObj<ToastService>;

  beforeEach(async () => {
    apiService = jasmine.createSpyObj('ApiService', ['deleteAccount']);
    authService = jasmine.createSpyObj('AuthService', ['logout']);
    toastService = jasmine.createSpyObj('ToastService', ['show']);

    await TestBed.configureTestingModule({
      imports: [DeleteAccount, HttpClientTestingModule],
      providers: [
        { provide: ApiService, useValue: apiService },
        { provide: AuthService, useValue: authService },
        { provide: ToastService, useValue: toastService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DeleteAccount);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call API and show toast + logout on success', () => {
    apiService.deleteAccount.and.returnValue(
      of({ ok: true, data: { message: 'Account deleted' }, errors: [] }),
    );

    component.deleteAccount();

    expect(apiService.deleteAccount).toHaveBeenCalled();
    expect(toastService.show).toHaveBeenCalledWith(
      'Account Deleted',
      'Your account has been deleted',
    );
    expect(authService.logout).toHaveBeenCalled();
  });

  it('should not throw on API error', () => {
    apiService.deleteAccount.and.returnValue(throwError(() => new Error('fail')));

    expect(toastService.show).not.toHaveBeenCalled();
    expect(authService.logout).not.toHaveBeenCalled();
  });
});
