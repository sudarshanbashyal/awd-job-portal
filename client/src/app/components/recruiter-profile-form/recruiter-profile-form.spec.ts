import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecruiterProfileForm } from './recruiter-profile-form';

describe('RecruiterProfileForm', () => {
  let component: RecruiterProfileForm;
  let fixture: ComponentFixture<RecruiterProfileForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecruiterProfileForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecruiterProfileForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
