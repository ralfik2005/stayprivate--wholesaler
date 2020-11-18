import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyCheckerComponent } from './company-checker.component';

describe('CompanyCheckerComponent', () => {
  let component: CompanyCheckerComponent;
  let fixture: ComponentFixture<CompanyCheckerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompanyCheckerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyCheckerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
