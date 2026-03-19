import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilePicture } from './profile-picture';
import { environment } from '../../environments/environment';

describe('ProfilePicture', () => {
  let component: ProfilePicture;
  let fixture: ComponentFixture<ProfilePicture>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfilePicture],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfilePicture);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should generate avatar from profile name when no profilePicture exists', () => {
    component.profile = {
      firstName: 'Test',
      lastName: 'User',
    } as any;

    component.ngOnChanges();

    expect(component.avatarUrl).toBe(`${environment.avatarApiUrl}&name=Test+User`);
  });
});
