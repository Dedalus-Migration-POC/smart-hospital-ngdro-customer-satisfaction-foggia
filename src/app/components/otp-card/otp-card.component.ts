import { Component, Input } from '@angular/core'
import { CommonModule } from '@angular/common'
import { DesignAngularKitModule } from 'design-angular-kit'
import { TranslateModule } from '@ngx-translate/core'
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms'

@Component({
  selector: 'app-otp-card',
  standalone: true,
  imports: [
    CommonModule,
    DesignAngularKitModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './otp-card.component.html',
  styleUrls: ['./otp-card.component.scss'],
})
export class OtpCardComponent {
  @Input() unit!: string // es: Cardiologia
  @Input() structureType!: string //es: reparto/ambulatorio

  otpInputForm = new FormGroup({
    otp: new FormControl<string>('', Validators.required),
    consent: new FormControl<boolean>(false, Validators.required),
  })

  constructor() { }

  submit() {
    console.log(this.otpInputForm.value)
  }



}
