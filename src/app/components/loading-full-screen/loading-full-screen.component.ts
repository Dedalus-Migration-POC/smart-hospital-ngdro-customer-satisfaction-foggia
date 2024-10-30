import { CommonModule } from '@angular/common'
import { Component, Input, OnInit } from '@angular/core'
import { DesignAngularKitModule } from 'design-angular-kit'

@Component({
  selector: 'app-loading-full-screen',
  standalone: true,
  imports: [CommonModule, DesignAngularKitModule],
  template: `<div class="full-screen-spinner">
    <it-spinner></it-spinner>
  </div>`,
  styleUrls: ['./loading-full-screen.component.scss'],
})
export class LoadingFullScreenComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
