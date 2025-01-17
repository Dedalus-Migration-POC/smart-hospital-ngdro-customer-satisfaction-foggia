import { Component, EventEmitter, Input, Output } from '@angular/core'
import { CommonModule } from '@angular/common'
import { DesignAngularKitModule } from 'design-angular-kit'
import { TranslateModule } from '@ngx-translate/core'
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms'
import { SmartHospitalState } from 'src/app/store/reducers'
import { Store } from '@ngrx/store'
import { selectQuestionnaireLoading } from 'src/app/pages/auth/state/selectors'
import { RouterModule } from '@angular/router'

@Component({
  selector: 'app-otp-card',
  standalone: true,
  imports: [
    CommonModule,
    DesignAngularKitModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
  ],
  templateUrl: './otp-card.component.html',
  styleUrls: ['./otp-card.component.scss'],
})
export class OtpCardComponent {
  @Input() unit!: string // es: Cardiologia
  @Input() structureType!: string //es: reparto/ambulatorio
  @Input() questType!: string //es: ricovero
  @Output() sendOtp = new EventEmitter()
  showError: boolean = false

  otpInputForm = new FormGroup({
    otp: new FormControl<string>('', Validators.required),
    age: new FormControl<string>('', Validators.required),
    consent: new FormControl<boolean>(false, Validators.required),
  })

  constructor(private store: Store<SmartHospitalState>) {}

  questionnaireLoading$ = this.store.select(selectQuestionnaireLoading)

  onAccept() {
    if (this.otpInputForm.value.consent === false) {
      document.getElementById('consent')?.click()
    }
  }
  submit() {
    if (
      this.otpInputForm.invalid ||
      this.otpInputForm.value.consent === false
    ) {
      this.showError = true
      return
    }
    this.showError = false
    this.sendOtp.emit(this.otpInputForm.value)
  }
}
