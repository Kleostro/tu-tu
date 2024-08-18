import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeatComponent } from './seat.component';

describe('SeatComponent', () => {
  let component: SeatComponent;
  let fixture: ComponentFixture<SeatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeatComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SeatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
