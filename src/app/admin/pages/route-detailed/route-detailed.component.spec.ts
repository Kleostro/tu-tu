import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RouteDetailedComponent } from './route-detailed.component';

describe('RouteDetailedComponent', () => {
  let component: RouteDetailedComponent;
  let fixture: ComponentFixture<RouteDetailedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouteDetailedComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RouteDetailedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
