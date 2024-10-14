import {Injectable} from '@angular/core'
import {Actions, createEffect, ofType} from '@ngrx/effects'
import {catchError, concatMap, map, withLatestFrom} from 'rxjs/operators'
import {forkJoin, of} from 'rxjs'
import {SurveyService} from "../repository/survey-service";
import {SurveyActions} from "./actions";
import {CreateSectionRequest} from "../repository/dto/create-section-request";
import {Store} from "@ngrx/store";
import {selectSectionList, selectSurveyList, SurveyAdminState} from "./reducer";
import {CreateSurveyRequest} from "../repository/dto/create-survey-request";
import {Survey} from "../repository/dto/survey";

@Injectable()
export class SurveyEffects {
  constructor(
    private store: Store<SurveyAdminState>,
    private actions$: Actions,
    private surveyService: SurveyService,
  ) {
  }

  initialize$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SurveyActions.initialize),
      concatMap(() =>
        forkJoin([
          this.surveyService.getSurveyList(),
          this.surveyService.getSectionList()
        ]).pipe(
          map(([surveys, sections]) =>
            SurveyActions.initializeSucceeded({surveys, sections})
          ),
          catchError(() =>
            of(SurveyActions.initializeFailed())
          )
        ),
      ),
    )
  })

  fetchSurveys$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SurveyActions.fetchSurveys),
      concatMap(() =>
        this.surveyService.getSurveyList().pipe(
          map((surveys) => SurveyActions.fetchSurveysSucceeded({surveys})),
          catchError(() =>
            of(SurveyActions.fetchSurveysFailed()),
          ),
        ),
      ),
    )
  })

  fetchSurveyById$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SurveyActions.fetchSurveyById),
      concatMap(({surveyId}) =>
        this.surveyService.getSurveyById(surveyId).pipe(
          map((survey) => SurveyActions.fetchSurveyByIdSucceeded({survey})),
          catchError(() =>
            of(SurveyActions.fetchSurveyByIdFailed()),
          ),
        ),
      ),
    )
  })

  fetchSections$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SurveyActions.fetchSections),
      concatMap(() =>
        this.surveyService.getSectionList().pipe(
          map((sections) => SurveyActions.fetchSectionsSucceeded({sections})),
          catchError(() =>
            of(SurveyActions.fetchSectionsFailed()),
          ),
        ),
      ),
    )
  })

  fetchSectionById$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SurveyActions.fetchSectionById),
      concatMap(({sectionId}) =>
        this.surveyService.getSectionById(sectionId).pipe(
          map((section) => SurveyActions.fetchSectionByIdSucceeded({section})),
          catchError(() =>
            of(SurveyActions.fetchSectionByIdFailed()),
          ),
        ),
      ),
    )
  })

  submitSurvey$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SurveyActions.submitSurvey),
      concatMap(({surveyForm}) => {
          if (!surveyForm.sections) {
            throw new Error("Cannot submit surveyForm because section list is not valid: " + surveyForm.sections)
          }
          const survey: CreateSurveyRequest = {
            id: surveyForm.id ? Number(surveyForm.id) : undefined,
            name: surveyForm.name!,
            description: surveyForm.description ?? undefined,
            startDate: surveyForm.startDate!,
            endDate: surveyForm.endDate ?? undefined,
            sections: surveyForm.sections,
          }
          const api = !survey.id
            ? this.surveyService.createSurvey(survey)
            : this.surveyService.updateSurvey(survey)
          return api.pipe(
            map((survey) => SurveyActions.submitSurveySucceeded({survey})),
            catchError(() =>
              of(SurveyActions.submitSurveyFailed()),
            ),
          )
        },
      ),
    )
  })

  deleteSurvey$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SurveyActions.deleteSurvey),
      withLatestFrom(this.store.select(selectSurveyList)),
      concatMap(([{surveyId}, {surveys}]) =>
        this.surveyService.deleteSurvey(surveyId).pipe(
          map(() => {
            const deletedSurvey = {...surveys.find(({id}) => id!.toString() === surveyId)!, deleted: true}
            const newSurveys = surveys.filter(({id}) => id!.toString() !== surveyId)
            return SurveyActions.deleteSurveySucceeded({updatedSurveys: [...newSurveys, deletedSurvey]})
          }),
          catchError(() =>
            of(SurveyActions.deleteSurveyFailed()),
          ),
        ),
      ),
    )
  })

  restoreSurvey$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SurveyActions.restoreSurvey),
      withLatestFrom(this.store.select(selectSurveyList)),
      concatMap(([{surveyId}, {surveys}]) =>
        this.surveyService.restoreSurvey(surveyId).pipe(
          map(() => {
            const restoredSurvey = {...surveys.find(({id}) => id!.toString() === surveyId)!, deleted: false}
            const newSurveys = surveys.filter(({id}) => id!.toString() !== surveyId)
            return SurveyActions.restoreSurveySucceeded({updatedSurveys: [...newSurveys, restoredSurvey]})
          }),
          catchError(() =>
            of(SurveyActions.restoreSurveyFailed()),
          ),
        ),
      ),
    )
  })

  publishSurvey$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SurveyActions.publishSurvey),
      withLatestFrom(this.store.select(selectSurveyList)),
      concatMap(([{surveyId}, {surveys}]) =>
        this.surveyService.publishSurvey(surveyId).pipe(
          map(() => {
            let survey = {...surveys.find(s => s.id!.toString() === surveyId), status: 'ACTIVE'} as Survey
            const updatedSurveys = [...surveys.filter(s => s.id!.toString() !== surveyId), survey]
            return SurveyActions.publishSurveySucceeded({updatedSurveys})
          }),
          catchError(() =>
            of(SurveyActions.publishSurveyFailed()),
          ),
        ),
      ),
    )
  })

  submitSection$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SurveyActions.submitSection),
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
            ? this.surveyService.createSection(section)
            : this.surveyService.updateSection(section)
          return api.pipe(
            map((section) => SurveyActions.submitSectionSucceeded({section})),
            catchError(() =>
              of(SurveyActions.submitSectionFailed()),
            ),
          )
        },
      ),
    )
  })

  deleteSection$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SurveyActions.deleteSection),
      withLatestFrom(this.store.select(selectSectionList)),
      concatMap(([{sectionId}, {sections}]) =>
        this.surveyService.deleteSection(sectionId).pipe(
          map(() => {
            const deletedSection = {...sections.find(({id}) => id!.toString() === sectionId)!, deleted: true}
            const newSections = sections.filter(({id}) => id!.toString() !== sectionId)
            return SurveyActions.deleteSectionSucceeded({updatedSections: [...newSections, deletedSection]})
          }),
          catchError(() =>
            of(SurveyActions.deleteSectionFailed()),
          ),
        ),
      ),
    )
  })

  restoreSection$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SurveyActions.restoreSection),
      withLatestFrom(this.store.select(selectSectionList)),
      concatMap(([{sectionId}, {sections}]) =>
        this.surveyService.restoreSection(sectionId).pipe(
          map(() => {
            const restoredSection = {...sections.find(({id}) => id!.toString() === sectionId)!, deleted: false}
            const newSections = sections.filter(({id}) => id!.toString() !== sectionId)
            return SurveyActions.restoreSectionSucceeded({updatedSections: [...newSections, restoredSection]})
          }),
          catchError(() =>
            of(SurveyActions.restoreSectionFailed()),
          ),
        ),
      ),
    )
  })
}
