import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeStatusModal } from './change-status-modal';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ChangeStatusModal', () => {
  let component: ChangeStatusModal;
  let fixture: ComponentFixture<ChangeStatusModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChangeStatusModal, HttpClientTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChangeStatusModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
