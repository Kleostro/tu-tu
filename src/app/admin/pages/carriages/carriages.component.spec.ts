import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarriagesComponent } from './carriages.component';

describe('CarriagesComponent', () => {
  let component: CarriagesComponent;
  let fixture: ComponentFixture<CarriagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarriagesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CarriagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
