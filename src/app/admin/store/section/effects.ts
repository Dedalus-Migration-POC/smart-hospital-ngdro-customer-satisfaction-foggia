import {Injectable} from '@angular/core'
import {Actions, createEffect, ofType} from '@ngrx/effects'
import {catchError, concatMap, map, withLatestFrom} from 'rxjs/operators'
import {of} from 'rxjs'
import {Store} from "@ngrx/store";
import {SurveyAdminState} from "../store";
import {SectionActions} from "./actions";
import {selectSectionList} from "./reducer";
import {CreateSectionRequest} from "../../repository/dto/create-section-request";
import {SectionService} from "../../repository/section-service";

@Injectable()
export class SectionEffects {
  constructor(
    private store: Store<SurveyAdminState>,
    private actions$: Actions,
    private sectionService: SectionService,
  ) {
  }

  private readonly fetchSections$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SectionActions.fetchSections),
      concatMap(({form}) =>
        this.sectionService.find({
          name: form.name ?? undefined,
          version: form.version ?? undefined,
          associatedSurveyIds: form.presentIn ? [form.presentIn] : undefined,
        }).pipe(
          map((response) => SectionActions.fetchSectionsSucceeded({sections: response.content})),
          catchError(() =>
            of(SectionActions.fetchSectionsFailed()),
          ),
        ),
      ),
    )
  })

  private readonly fetchSectionById$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SectionActions.fetchSectionById),
      concatMap(({sectionId}) =>
        this.sectionService.findById(sectionId).pipe(
          map((section) => SectionActions.fetchSectionByIdSucceeded({section})),
          catchError(() =>
            of(SectionActions.fetchSectionByIdFailed()),
          ),
        ),
      ),
    )
  })

  private readonly submitSection$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SectionActions.submitSection),
      concatMap(({sectionForm}) => {
          if (!sectionForm.questions) {
            throw new Error("Cannot submit sectionForm because question list is not valid: " + sectionForm.questions)
          }
          const section: CreateSectionRequest = {
            id: sectionForm.id ? Number(sectionForm.id) : undefined,
            name: sectionForm.name!,
            description: sectionForm.description ?? undefined,
            questions: sectionForm.questions.map(q => ({
              answerType: 'RATE',
              name: q!
            }))
          }
          const api = !section.id
            ? this.sectionService.create(section)
            : this.sectionService.update(section)
          return api.pipe(
            map((section) => SectionActions.submitSectionSucceeded({section})),
            catchError(() =>
              of(SectionActions.submitSectionFailed()),
            ),
          )
        },
      ),
    )
  })

  private readonly deleteSection$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SectionActions.deleteSection),
      withLatestFrom(this.store.select(selectSectionList)),
      concatMap(([{sectionId}, {sections}]) =>
        this.sectionService.delete(sectionId).pipe(
          map(() => {
            const deletedSection = {...sections.find(({id}) => id!.toString() === sectionId)!, deleted: true}
            const newSections = sections.filter(({id}) => id!.toString() !== sectionId)
            return SectionActions.deleteSectionSucceeded({updatedSections: [...newSections, deletedSection]})
          }),
          catchError(() =>
            of(SectionActions.deleteSectionFailed()),
          ),
        ),
      ),
    )
  })

  private readonly restoreSection$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SectionActions.restoreSection),
      withLatestFrom(this.store.select(selectSectionList)),
      concatMap(([{sectionId}, {sections}]) =>
        this.sectionService.restore(sectionId).pipe(
          map(() => {
            const restoredSection = {...sections.find(({id}) => id!.toString() === sectionId)!, deleted: false}
            const newSections = sections.filter(({id}) => id!.toString() !== sectionId)
            return SectionActions.restoreSectionSucceeded({updatedSections: [...newSections, restoredSection]})
          }),
          catchError(() =>
            of(SectionActions.restoreSectionFailed()),
          ),
        ),
      ),
    )
  })
}
