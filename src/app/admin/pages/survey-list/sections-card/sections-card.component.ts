import {AfterViewChecked, ChangeDetectorRef, Component} from '@angular/core';
import {MatButton} from "@angular/material/button";
import {MatCard, MatCardContent, MatCardHeader} from "@angular/material/card";
import {RouterLink} from "@angular/router";
import {TranslateModule} from "@ngx-translate/core";
import {map, Observable} from "rxjs";
import {Section} from "../../../repository/dto/section";
import {Store} from "@ngrx/store";
import {AsyncPipe, NgIf} from "@angular/common";
import {MatIcon} from "@angular/material/icon";
import {SurveyAdminState} from "../../../store/store";
import {selectSectionState} from "../../../store/section/reducer";

@Component({
  selector: 'app-sections-card',
  standalone: true,
  imports: [
    MatButton,
    MatCard,
    MatCardHeader,
    MatCardContent,
    RouterLink,
    TranslateModule,
    AsyncPipe,
    MatIcon,
    NgIf
  ],
  templateUrl: './sections-card.component.html',
  styleUrl: './sections-card.component.scss'
})
export class SectionsCardComponent implements AfterViewChecked {
  constructor(
    private store: Store<SurveyAdminState>,
    private changeDetectorRef: ChangeDetectorRef
  ) {
  }

  sections$: Observable<Array<Section>> = this.store.select(selectSectionState).pipe(map(({sections}) => sections));
  createSurveyBtn: HTMLElement | null | undefined;

  ngAfterViewChecked() {
    this.createSurveyBtn = window.document.getElementById('create-survey-btn')
    this.changeDetectorRef.detectChanges();
  }
}
