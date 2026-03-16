import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ToastService, ToastMessage } from './toast.service';

describe('ToastService', () => {
  let service: ToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToastService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should emit toast message when show is called', (done) => {
    const expected: ToastMessage = {
      title: 'Test',
      text: 'Hello',
      type: 'success',
    };

    service.toastState$.subscribe((msg) => {
      if (msg) {
        expect(msg).toEqual(expected);
        done();
      }
    });

    service.show('Test', 'Hello', 'success');
  });

  it('should reset toast message to null after 3 seconds', fakeAsync(() => {
    service.show('Title', 'Message', 'error');

    let current: any;
    service.toastState$.subscribe((msg) => (current = msg));

    expect(current).toEqual({
      title: 'Title',
      text: 'Message',
      type: 'error',
    });

    tick(3000);

    expect(current).toBeNull();
  }));

  it('should default type to success if not provided', (done) => {
    service.toastState$.subscribe((msg) => {
      if (msg) {
        expect(msg.type).toBe('success');
        done();
      }
    });

    service.show('Title', 'Message');
  });
});
