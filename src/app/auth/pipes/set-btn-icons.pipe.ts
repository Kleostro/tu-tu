import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'setBtnIcons',
  standalone: true,
})
export class SetBtnIconsPipe implements PipeTransform {
  public transform(state: string, isSignUp = false): string {
    const stateToIconMap: { [key: string]: string } = {
      init: isSignUp ? 'pi pi-user-plus' : 'pi pi-user',
      load: 'pi pi-spin pi-spinner',
      success: 'pi pi-verified',
      error: 'pi pi-ban',
    };

    return stateToIconMap[state];
  }
}
