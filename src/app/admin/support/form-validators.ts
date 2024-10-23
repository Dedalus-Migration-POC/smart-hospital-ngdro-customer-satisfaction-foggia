import {SurveyService} from "../repository/survey-service";
import {AbstractControl, AsyncValidator, ValidationErrors} from "@angular/forms";
import {map, Observable, of} from "rxjs";
import {Injectable} from "@angular/core";
import {catchError} from "rxjs/operators";
import {SectionService} from "../repository/section-service";
import {BaseDTO} from "../repository/dto/base_dto";

const nameExists = (content: Array<BaseDTO>, searchTerm: string): boolean =>
  content.some((({name}) => name.toLowerCase() === searchTerm.toLowerCase()))

@Injectable({providedIn: 'root'})
export class SurveyNameValidator implements AsyncValidator {
  constructor(private surveyService: SurveyService) {
  }

  validate(control: AbstractControl): Observable<ValidationErrors | null> {
    return this.surveyService.find({name: control.value}).pipe(
      map(({content}) => nameExists(content, control.value as string) ? {alreadyExists: true} : null),
      catchError(() => of(null)),
    );
  }
}

@Injectable({providedIn: 'root'})
export class SectionNameValidator implements AsyncValidator {
  constructor(private sectionService: SectionService) {
  }

  validate(control: AbstractControl): Observable<ValidationErrors | null> {
    return this.sectionService.find({name: control.value}).pipe(
      map(({content}) => nameExists(content, control.value as string) ? {alreadyExists: true} : null),
      catchError(() => of(null)),
    );
  }
}
