import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarriagesListComponent } from './carriages-list.component';

describe('CarriagesListComponent', () => {
  let component: CarriagesListComponent;
  let fixture: ComponentFixture<CarriagesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarriagesListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CarriagesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
