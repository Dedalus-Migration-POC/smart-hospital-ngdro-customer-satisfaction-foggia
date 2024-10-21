import {MatDateFormats, NativeDateAdapter} from "@angular/material/core";
import {Injectable} from "@angular/core";
import {DatePipe} from "@angular/common";

export const APP_DATE_FORMATS: MatDateFormats = {
  parse: {
    dateInput: 'DD/MM/YYYY'
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'DD/MM/YYYY',
    monthYearA11yLabel: 'MMMM YYYY',
  }
};

@Injectable()
export class AppDateAdapter extends NativeDateAdapter {

  public override format(date: Date, displayFormat: Object): string {
    if (displayFormat === 'input') {
      return new DatePipe("it").transform(date, "dd/MM/yyyy HH:mm") as string
    }

    return date.toDateString()
  }
}
