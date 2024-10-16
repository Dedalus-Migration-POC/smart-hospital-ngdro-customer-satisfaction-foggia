import {Component, EventEmitter, Input, Output} from '@angular/core';
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {MatTooltip} from "@angular/material/tooltip";

@Component({
  selector: 'app-toggle-button',
  standalone: true,
  imports: [
    MatButton,
    MatIcon,
    MatTooltip,
    MatIconButton
  ],
  template: `
    <button type="button" mat-icon-button (click)="onClick.emit()">
      <mat-icon [matTooltip]="status ? activeLabel : idleLabel">{{ status ? activeIcon : idleIcon }}</mat-icon>
    </button>`,
  styleUrl: './toggle-button.component.scss'
})
export class ToggleButtonComponent {
  @Input({alias: 'idleLabel', required: true}) idleLabel!: string;
  @Input({alias: 'activeLabel', required: true}) activeLabel!: string;
  @Input({alias: 'idleIcon', required: true}) idleIcon!: string;
  @Input({alias: 'activeIcon', required: true}) activeIcon!: string;
  @Input({alias: 'status', required: true}) status!: boolean;
  @Input({
    alias: 'buttonType',
    required: false
  }) buttonType?: 'mat-button' | 'mat-raised-button' | 'mat-flat-button' | 'mat-stroked-button';
  @Output('onClick') onClick: EventEmitter<void> = new EventEmitter();

  protected getMatDirective() {
    switch (this.buttonType) {
      case 'mat-raised-button':
        return true;
      case 'mat-flat-button':
        return true;
      case 'mat-stroked-button':
        return true;
      default:
        return false;
    }
  }
}
