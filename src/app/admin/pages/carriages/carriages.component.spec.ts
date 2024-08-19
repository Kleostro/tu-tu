import { provideHttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { of } from 'rxjs';

import { CarriagesComponent } from './carriages.component';

describe('CarriagesComponent', () => {
  let component: CarriagesComponent;
  let fixture: ComponentFixture<CarriagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarriagesComponent],
      providers: [provideHttpClient(), { provide: ActivatedRoute, useValue: { queryParams: of({}) } }],
    }).compileComponents();

    fixture = TestBed.createComponent(CarriagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
