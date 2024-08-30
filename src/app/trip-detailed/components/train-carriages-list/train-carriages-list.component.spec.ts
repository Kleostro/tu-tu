import { provideHttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Carriage } from '@/app/api/models/carriage';

import { TrainCarriagesListService } from '../../services/train-carriages-list/train-carriages-list.service';
import { TrainCarriagesListComponent } from './train-carriages-list.component';

describe('TrainCarriagesListComponent', () => {
  let component: TrainCarriagesListComponent;
  let fixture: ComponentFixture<TrainCarriagesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrainCarriagesListComponent],
      providers: [
        provideHttpClient(),
        {
          provide: TrainCarriagesListService,
          useValue: {
            currentTrainCarriages$$: (): Carriage[] => [],
            currentCarriageType$$: (): string => '',
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TrainCarriagesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});