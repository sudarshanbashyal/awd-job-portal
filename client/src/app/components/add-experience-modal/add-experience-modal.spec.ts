import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddExperienceModal } from './add-experience-modal';

describe('AddExperienceModal', () => {
  let component: AddExperienceModal;
  let fixture: ComponentFixture<AddExperienceModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddExperienceModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddExperienceModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
