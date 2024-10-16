import {AfterViewChecked, ChangeDetectorRef, Component} from '@angular/core';
import {ScaffoldComponent} from "../../components/scaffold/scaffold.component";
import {map, of, take, tap} from "rxjs";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {MatFormField, MatInput, MatSuffix} from "@angular/material/input";
import {FormsModule} from "@angular/forms";
import {MatLabel} from "@angular/material/form-field";
import {SectionListTableComponent} from "./section-list-table/section-list-table.component";
import {Store} from "@ngrx/store";
import {AsyncPipe, NgIf} from "@angular/common";
import {Section} from "../../repository/dto/section";
import {DialogService} from "../../support/dialog-service";
import {WithSubscriptionsComponent} from "../../support/with-subscriptions-component";
import {Actions, ofType} from "@ngrx/effects";
import {SectionActions} from "../../store/section/actions";
import {SurveyAdminState} from "../../store/store";
import {selectSectionList} from "../../store/section/reducer";
import {selectSurveyList} from "../../store/survey/reducer";
import {FilterComponent} from "./section-list-table/filter/filter.component";

@Component({
  selector: 'app-section-list',
  standalone: true,
  imports: [
    ScaffoldComponent,
    TranslateModule,
    MatButton,
    MatIcon,
    RouterLink,
    MatInput,
    MatFormField,
    FormsModule,
    MatIconButton,
    MatLabel,
    MatSuffix,
    SectionListTableComponent,
    AsyncPipe,
    NgIf,
    FilterComponent,
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
  loading$ = this.state$.pipe(map(({fetchingSections}) => fetchingSections))
  error$ = this.state$.pipe(map(({fetchSectionsError}) => fetchSectionsError))

  searchField = ''

  protected search() {
    console.log(this.searchField);
  }

  protected async onEdit(section: Section) {
    await this.router.navigate(['form', section.id], {relativeTo: this.activatedRoute})
  }

  protected onDelete(section: Section) {
    console.log(section)
    this.addSubscription(this.store.select(selectSurveyList).pipe(
      take(1),
      map(({surveys}) => {
        console.log(surveys)
        if (surveys.some(({sections}) => !!sections.find(({id}) => id === section.id))) {
          console.log('found')
          this.dialog.error({
            buttonsType: 'ok',
            text: this.translate.instant('admin.section-list.dialog-cannot-delete')
          })
        } else {
          this.dialog.attention({
            buttonsType: 'ok',
            text: this.translate.instant('admin.section-list.dialog-confirm-delete'),
            onConfirm: () => this.store.dispatch(SectionActions.deleteSection({sectionId: section.id!.toString()}))
          })
        }
      })).subscribe())
  }

  protected onRestore({id}: Section) {
    this.dialog.attention({
      buttonsType: 'ok',
      text: this.translate.instant('admin.section-list.dialog-confirm-restore'),
      onConfirm: () => this.store.dispatch(SectionActions.restoreSection({sectionId: id!.toString()}))
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

  protected readonly of = of;
}
