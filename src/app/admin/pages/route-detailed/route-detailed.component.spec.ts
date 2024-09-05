import { provideHttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { RouteDetailedComponent } from './route-detailed.component';

describe('RouteDetailedComponent', () => {
  let component: RouteDetailedComponent;
  let fixture: ComponentFixture<RouteDetailedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouteDetailedComponent],
      providers: [provideHttpClient(), { provide: ActivatedRoute, useValue: {} }],
    }).compileComponents();

    fixture = TestBed.createComponent(RouteDetailedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
