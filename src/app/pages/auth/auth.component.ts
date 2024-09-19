import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { Store } from '@ngrx/store'
import { SmartHospitalState } from 'src/app/store/reducers'
import { fetchQuestionnaire } from './state/actions'

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit {
  constructor(
    private activatedRoute: ActivatedRoute,
    private store: Store<SmartHospitalState>,
  ) {}

  structureType: string = ''
  unit: string = ''
  questType: string = ''
  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.structureType = params['structureType']
      this.unit = params['unit']
      this.questType = params['questType']
    })
  }

  sendOtp(form: { otp: string; consent: boolean }) {
    this.store.dispatch(fetchQuestionnaire({ payload: form }))
    console.log(form)
  }
}
