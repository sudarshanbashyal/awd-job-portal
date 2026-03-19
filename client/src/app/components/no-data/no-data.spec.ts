import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoData } from './no-data';

describe('NoData', () => {
  let component: NoData;
  let fixture: ComponentFixture<NoData>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoData]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoData);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
