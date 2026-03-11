import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateJob } from './create-job';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('CreateJob', () => {
  let component: CreateJob;
  let fixture: ComponentFixture<CreateJob>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateJob, HttpClientTestingModule, RouterTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateJob);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
