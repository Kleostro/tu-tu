import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { of } from 'rxjs';

import { CarriagesListComponent } from './carriages-list.component';

describe('CarriagesListComponent', () => {
  let component: CarriagesListComponent;
  let fixture: ComponentFixture<CarriagesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarriagesListComponent],
      providers: [{ provide: ActivatedRoute, useValue: { queryParams: of({}) } }],
    }).compileComponents();

    fixture = TestBed.createComponent(CarriagesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
