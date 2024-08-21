import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RouteFormComponent } from './route-form.component';

describe('RouteFormComponent', () => {
  let component: RouteFormComponent;
  let fixture: ComponentFixture<RouteFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouteFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RouteFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
