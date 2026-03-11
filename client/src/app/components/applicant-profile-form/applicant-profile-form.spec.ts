import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicantProfileForm } from './applicant-profile-form';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ApplicantProfileForm', () => {
  let component: ApplicantProfileForm;
  let fixture: ComponentFixture<ApplicantProfileForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApplicantProfileForm, HttpClientTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(ApplicantProfileForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
