import { provideHttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageService } from 'primeng/api';

import { CreateCarriageFormComponent } from './create-carriage-form.component';

describe('CreateCarriageFormComponent', () => {
  let component: CreateCarriageFormComponent;
  let fixture: ComponentFixture<CreateCarriageFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateCarriageFormComponent],
      providers: [{ provide: MessageService, useValue: {} }, provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateCarriageFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
