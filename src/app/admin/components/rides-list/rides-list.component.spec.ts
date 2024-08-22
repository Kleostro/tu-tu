import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RidesListComponent } from './rides-list.component';

describe('RidesListComponent', () => {
  let component: RidesListComponent;
  let fixture: ComponentFixture<RidesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RidesListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RidesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
