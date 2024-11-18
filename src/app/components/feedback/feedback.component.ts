import { CommonModule } from '@angular/common'
import { Component, OnInit } from '@angular/core'
import { TranslateModule } from '@ngx-translate/core'
import { DesignAngularKitModule } from 'design-angular-kit'

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss'],
  standalone: true,
  imports: [CommonModule, TranslateModule, DesignAngularKitModule],
})
export class FeedbackComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
