import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEducationModal } from './add-education-modal';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AddEducationModal', () => {
  let component: AddEducationModal;
  let fixture: ComponentFixture<AddEducationModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEducationModal, HttpClientTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(AddEducationModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
