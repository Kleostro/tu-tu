import { provideHttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageService } from 'primeng/api';

import { UpdateCarriageFormComponent } from './update-carriage-form.component';

describe('UpdateCarriageFormComponent', () => {
  let component: UpdateCarriageFormComponent;
  let fixture: ComponentFixture<UpdateCarriageFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateCarriageFormComponent],
      providers: [{ provide: MessageService, useValue: {} }, provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(UpdateCarriageFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
