import {Component} from '@angular/core';
import {AsyncPipe} from "@angular/common";
import {MatButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {RouterLink} from "@angular/router";
import {TranslateModule} from "@ngx-translate/core";
import {map, Observable} from "rxjs";
import {Section} from "../../../repository/dto/section";
import {selectSectionState} from "../../../store/section/reducer";
import {Store} from "@ngrx/store";
import {SurveyAdminState} from "../../../store/store";
import {MatDialog} from "@angular/material/dialog";
import {PrintSurveyDialogComponent} from "../print-survey-dialog/print-survey-dialog.component";

@Component({
  selector: 'app-top-right-buttons',
  standalone: true,
  imports: [
    AsyncPipe,
    MatButton,
    MatIcon,
    RouterLink,
    TranslateModule
  ],
  templateUrl: './top-right-buttons.component.html',
  styleUrl: './top-right-buttons.component.scss'
})
export class TopRightButtonsComponent {
  constructor(
    private store: Store<SurveyAdminState>,
    private dialog: MatDialog
  ) {
  }

  sections$: Observable<Array<Section>> = this.store.select(selectSectionState).pipe(map(({sections}) => sections));

  protected print() {
    this.dialog.open<PrintSurveyDialogComponent>(PrintSurveyDialogComponent, {
      width: '360px',
      maxWidth: '480px',
      minHeight: '480px',
      hasBackdrop: true,
      disableClose: true,
    })
  }

  protected viewAnalytics() {
    console.log('missing analytics url')
  }
}
