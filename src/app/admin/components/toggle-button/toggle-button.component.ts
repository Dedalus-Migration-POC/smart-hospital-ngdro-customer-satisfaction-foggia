import { Component, EventEmitter, Input, Output } from '@angular/core'
import { MatButton, MatIconButton } from '@angular/material/button'
import { MatIcon } from '@angular/material/icon'
import { MatTooltip } from '@angular/material/tooltip'

@Component({
  selector: 'app-toggle-button',
  standalone: true,
  imports: [MatButton, MatIcon, MatTooltip, MatIconButton],
  template: ` <button
    type="button"
    mat-icon-button
    (click)="onClick.emit()"
    [class]="'button-action-' + (isActive ? activeIcon : inactiveIcon)"
  >
    <mat-icon
      fontSet="material-icons-outlined"
      [matTooltip]="isActive ? activeTooltip : inactiveTooltip"
      >{{ isActive ? activeIcon : inactiveIcon }}
    </mat-icon>
  </button>`,
  styleUrl: './toggle-button.component.scss',
})
export class ToggleButtonComponent {
  @Input({ alias: 'isActive', required: true }) isActive!: boolean
  @Input({ alias: 'activeTooltip', required: true }) activeTooltip!: string
  @Input({ alias: 'inactiveTooltip', required: true }) inactiveTooltip!: string
  @Input({ alias: 'activeIcon', required: true }) activeIcon!: string
  @Input({ alias: 'inactiveIcon', required: true }) inactiveIcon!: string
  @Output('onClick') onClick: EventEmitter<void> = new EventEmitter()
}
