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
    MatFormField
  ],
  templateUrl: './print-card.component.html',
  styleUrl: './print-card.component.scss'
})
export class PrintCardComponent {
  @Input({alias: "surveys", required: true}) surveys!: Array<Survey>;

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
