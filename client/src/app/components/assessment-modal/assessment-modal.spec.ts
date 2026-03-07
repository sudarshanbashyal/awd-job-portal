import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssessmentModal } from './assessment-modal';

describe('AssessmentModal', () => {
  let component: AssessmentModal;
  let fixture: ComponentFixture<AssessmentModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssessmentModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssessmentModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
