import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TripDetailedComponent } from './trip-detailed.component';

describe('TripDetailedComponent', () => {
  let component: TripDetailedComponent;
  let fixture: ComponentFixture<TripDetailedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TripDetailedComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TripDetailedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
