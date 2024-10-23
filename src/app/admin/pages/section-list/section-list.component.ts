import {AfterViewChecked, ChangeDetectorRef, Component} from '@angular/core';
import {map, take, tap} from "rxjs";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {Store} from "@ngrx/store";
import {Section} from "../../repository/dto/section";
import {DialogService} from "../../support/dialog-service";
import {WithSubscriptionsComponent} from "../../support/with-subscriptions-component";
import {Actions, ofType} from "@ngrx/effects";
import {SectionActions} from "../../store/section/actions";
import {SurveyAdminState} from "../../store/store";
import {selectSectionList} from "../../store/section/reducer";
import {selectSurveyList} from "../../store/survey/reducer";
import {MatButton} from "@angular/material/button";
import {FilterComponent} from "./section-list-table/filter/filter.component";
import {SectionListTableComponent} from "./section-list-table/section-list-table.component";
import {MatIcon} from "@angular/material/icon";

@Component({
  selector: 'app-section-list',
  standalone: true,
  imports: [
    MatButton,
    MatIcon,
    RouterLink,
    TranslateModule,
    FilterComponent,
    SectionListTableComponent
  ],
  templateUrl: './section-list.component.html',
  styleUrl: './section-list.component.scss'
})
export class SectionListComponent extends WithSubscriptionsComponent implements AfterViewChecked {

  constructor(
    private store: Store<SurveyAdminState>,
    private actions: Actions,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private dialog: DialogService,
    private translate: TranslateService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    super();
    this.startSubscriptions();
  }

  createSurveyBtn: HTMLElement | null | undefined;

  ngAfterViewChecked() {
    this.createSurveyBtn = window.document.getElementById('create-survey-btn')
    this.changeDetectorRef.detectChanges();
  }

  state$ = this.store.select(selectSectionList)
  sections$ = this.state$.pipe(map(({sections}) => sections));

  protected async onEdit(section: Section) {
    if (section.associatedSurveys?.length) {
      this.dialog.info({
        buttonsType: 'yes_no',
        text: this.translate.instant('admin.section-list.dialog-confirm-clone', {name: section.name}),
        onConfirm: () => this.store.dispatch(SectionActions.cloneSection({section}))
      })
    } else {
      await this.router.navigate(['section-form', section.id], {relativeTo: this.activatedRoute})
    }
  }

  protected onDelete(section: Section) {
    this.addSubscription(this.store.select(selectSurveyList).pipe(
      take(1),
      map(({surveys}) => {
        console.log(surveys)
        if ((surveys?.content ?? []).some(({sections}) => !!sections.find(({id}) => id === section.id))) {
          console.log('found')
          this.dialog.error({
            buttonsType: 'ok',
            text: this.translate.instant('admin.section-list.dialog-cannot-delete')
          })
        } else {
          this.dialog.attention({
            buttonsType: 'yes_no',
            text: this.translate.instant('admin.section-list.dialog-confirm-delete'),
            onConfirm: () => this.store.dispatch(SectionActions.deleteSection({section}))
          })
        }
      })).subscribe())
  }

  protected onRestore(section: Section) {
    this.dialog.attention({
      buttonsType: 'yes_no',
      text: this.translate.instant('admin.section-list.dialog-confirm-restore'),
      onConfirm: () => this.store.dispatch(SectionActions.restoreSection({section}))
    })
  }

  private startSubscriptions() {
    this.addSubscriptions(
      this.actions.pipe(
        ofType(SectionActions.deleteSectionFailed),
        tap(() => this.dialog.error({buttonsType: 'ok'}))
      ).subscribe(),

      this.actions.pipe(
        ofType(SectionActions.restoreSectionFailed),
        tap(() => this.dialog.error({buttonsType: 'ok'}))
      ).subscribe()
    )
  }
}
