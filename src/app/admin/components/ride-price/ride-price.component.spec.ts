import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RidePriceComponent } from './ride-price.component';

describe('RidePriceComponent', () => {
  let component: RidePriceComponent;
  let fixture: ComponentFixture<RidePriceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RidePriceComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RidePriceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
