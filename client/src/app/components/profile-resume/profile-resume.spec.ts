import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileResume } from './profile-resume';

describe('ProfileResume', () => {
  let component: ProfileResume;
  let fixture: ComponentFixture<ProfileResume>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileResume]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileResume);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
