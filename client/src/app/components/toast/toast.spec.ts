import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Toast } from './toast';
import { ToastService } from '../../services';
import { BehaviorSubject } from 'rxjs';

describe('Toast', () => {
  let component: Toast;
  let fixture: ComponentFixture<Toast>;
  let toastService: jasmine.SpyObj<ToastService>;

  const toastSubject = new BehaviorSubject<any>(null);

  beforeEach(async () => {
    toastService = jasmine.createSpyObj('ToastService', [], {
      toastState$: toastSubject.asObservable(),
    });

    await TestBed.configureTestingModule({
      imports: [Toast],
      providers: [{ provide: ToastService, useValue: toastService }],
    }).compileComponents();

    fixture = TestBed.createComponent(Toast);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize toast$ from the service', () => {
    expect(component.toast$).toBe(toastService.toastState$);
  });

  it('should receive toast values from the service observable', (done) => {
    const toastMessage = { title: 'test toast', text: 'test message', type: 'error' as any };

    component.toast$.subscribe((value) => {
      if (value) {
        expect(value).toEqual(toastMessage);
        done();
      }
    });

    toastSubject.next(toastMessage);
  });
});
