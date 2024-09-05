import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RideTimeComponent } from './ride-time.component';

describe('RideTimeComponent', () => {
  let component: RideTimeComponent;
  let fixture: ComponentFixture<RideTimeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RideTimeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RideTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
