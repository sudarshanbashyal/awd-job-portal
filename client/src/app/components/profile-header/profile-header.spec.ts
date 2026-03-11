import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileHeader } from './profile-header';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ProfileHeader', () => {
  let component: ProfileHeader;
  let fixture: ComponentFixture<ProfileHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileHeader, HttpClientTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileHeader);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
