import { FormControl, FormGroup } from '@angular/forms';

export type TimesFGType = FormGroup<{ departure: FormControl<string>; arrival: FormControl<string> }>;
export type CarriageTypesFGType = FormGroup<{ [key: string]: FormControl<number> }>;
export interface CarriageTypeControls {
  [key: string]: FormControl<number>;
}
