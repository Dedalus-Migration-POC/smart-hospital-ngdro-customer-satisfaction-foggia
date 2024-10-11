import {NativeDateAdapter} from "@angular/material/core";
import {Injectable} from "@angular/core";
import {DatePipe} from "@angular/common";

export const MY_FORMATS = {
  parse: {
    dateInput: {month: "numeric", year: "numeric", day: "numeric"}
  },
  display: {
    dateInput: "input",
    monthYearLabel: {year: "numeric", month: "numeric"},
    dateA11yLabel: {year: "numeric", month: "long", day: "numeric"},
    monthYearA11yLabel: {year: "numeric", month: "long"}
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
