import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Skill } from './skill';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('Skill', () => {
  let component: Skill;
  let fixture: ComponentFixture<Skill>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Skill, HttpClientTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(Skill);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
