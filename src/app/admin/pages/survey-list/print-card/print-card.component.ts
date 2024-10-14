import {Component, Input} from '@angular/core';
import {MatButton} from "@angular/material/button";
import {MatButtonToggle, MatButtonToggleGroup} from "@angular/material/button-toggle";
import {MatCard, MatCardContent, MatCardHeader} from "@angular/material/card";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatOption} from "@angular/material/core";
import {MatRadioButton, MatRadioGroup} from "@angular/material/radio";
import {MatSelect} from "@angular/material/select";
import {TranslateModule} from "@ngx-translate/core";
import {FormsModule} from "@angular/forms";
import {Survey} from "../../../repository/dto/survey";
import {Store} from "@ngrx/store";
import {map, Observable} from "rxjs";
import {AsyncPipe} from "@angular/common";
import {SurveyAdminState} from "../../../store/store";
import {selectSurveyState} from "../../../store/survey/reducer";

@Component({
  selector: 'app-print-card',
  standalone: true,
  imports: [
    MatButton,
    MatButtonToggle,
    MatButtonToggleGroup,
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatLabel,
    MatOption,
    MatRadioButton,
    MatRadioGroup,
    MatSelect,
    TranslateModule,
    FormsModule,
    MatFormField,
    AsyncPipe
  ],
  templateUrl: './print-card.component.html',
  styleUrl: './print-card.component.scss'
})
export class PrintCardComponent {
  @Input({alias: "surveys", required: true}) surveys!: Array<Survey>;

  constructor(private store: Store<SurveyAdminState>) {
  }

  state$ = this.store.select(selectSurveyState)
  disabled$: Observable<boolean> = this.state$.pipe(map(({surveys}) => !surveys.length));

  selectedSurveyId: string | number | null = null
  selectedUnit: string | null = null
  printCount = 0

  units = [
    {value: 'cardio', viewValue: 'cardio'},
  ];

  protected setPrintCount(value: number) {
    this.printCount = value;
  }

  protected print() {
    console.log('print ', this.selectedUnit)
  }
}
