import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSkillModal } from './add-skill-modal';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AddSkillModal', () => {
  let component: AddSkillModal;
  let fixture: ComponentFixture<AddSkillModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddSkillModal, HttpClientTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(AddSkillModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
