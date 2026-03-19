import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicantsTable } from './applicants-table';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('ApplicantsTable', () => {
  let component: ApplicantsTable;
  let fixture: ComponentFixture<ApplicantsTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApplicantsTable, HttpClientTestingModule, RouterTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApplicantsTable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
