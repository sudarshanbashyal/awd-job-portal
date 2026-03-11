import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Education } from './education';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('Education', () => {
  let component: Education;
  let fixture: ComponentFixture<Education>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Education, HttpClientTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(Education);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
