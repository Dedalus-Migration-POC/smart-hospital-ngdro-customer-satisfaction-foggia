import {Injectable} from "@angular/core";
import {MatDialog, MatDialogConfig, MatDialogRef} from "@angular/material/dialog";
import {DialogComponent, DialogProps} from "../components/dialog/dialog.component";

type Props = Omit<DialogProps, 'type'>

@Injectable({providedIn: 'root'})
export class DialogService {
  constructor(private dialog: MatDialog) {
  }

  private readonly defaultDialogSettings: MatDialogConfig = {
    width: '640px',
    height: '320px',
  }

  public info(props: Props): MatDialogRef<DialogComponent, Props> {
    return this.dialog.open<DialogComponent, DialogProps>(DialogComponent, {
      ...this.defaultDialogSettings,
      data: {...props, type: 'info'}
    })
  }

  public success(props?: Props): MatDialogRef<DialogComponent, Props> {
    return this.dialog.open<DialogComponent, DialogProps>(DialogComponent, {
      ...this.defaultDialogSettings,
      data: {...props, type: 'success'}
    })
  }

  public attention(props?: Props): MatDialogRef<DialogComponent, Props> {
    return this.dialog.open<DialogComponent, DialogProps>(DialogComponent, {
      ...this.defaultDialogSettings,
      data: {...props, type: 'attention'}
    })
  }

  public error(props?: Props): MatDialogRef<DialogComponent, Props> {
    return this.dialog.open<DialogComponent, DialogProps>(DialogComponent, {
      ...this.defaultDialogSettings,
      data: {...props, type: 'error'}
    })
  }

}
