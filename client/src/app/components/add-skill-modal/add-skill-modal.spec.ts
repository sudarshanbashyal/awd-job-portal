import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSkillModal } from './add-skill-modal';

describe('AddSkillModal', () => {
  let component: AddSkillModal;
  let fixture: ComponentFixture<AddSkillModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddSkillModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddSkillModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
