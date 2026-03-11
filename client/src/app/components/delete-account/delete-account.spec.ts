import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteAccount } from './delete-account';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('DeleteAccount', () => {
  let component: DeleteAccount;
  let fixture: ComponentFixture<DeleteAccount>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteAccount, HttpClientTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(DeleteAccount);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
