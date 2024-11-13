import {Component} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {EMPTY, map} from "rxjs";
import {catchError} from "rxjs/operators";

@Component({
  selector: 'app-template-form',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './template-form.component.html',
  styleUrl: './template-form.component.scss'
})
export class TemplateFormComponent {
  reportForm: FormGroup<{
    tenant: FormControl<string | null>
    name: FormControl<string | null>
    type: FormControl<string | null>
    file: FormControl<Blob | null>
  }>;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.reportForm = this.fb.group({
      tenant: new FormControl('root', [Validators.required]),
      name: new FormControl('Foggia', [Validators.required]),
      type: new FormControl('JASPER', [Validators.required]),
      file: new FormControl<Blob | null>(null, [Validators.required]),
    });
  }

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.reportForm.patchValue({
        file: file
      });
    }
  }

  submitForm() {
    const formData = new FormData();
    console.log(this.reportForm.value)
    formData.append('tenant', this.reportForm.value.tenant ?? '');
    formData.append('name', this.reportForm.value.name ?? '');
    formData.append('type', this.reportForm.value.type ?? '');
    formData.append('file', this.reportForm.value.file!);
    console.log(formData, this.reportForm.value)
    this.http.post('/reports-engine/api/v1/report/template', formData).pipe(
      map(
        response => {
          console.log('Upload successful', response);
        },
      ),
      catchError(error => {
        console.error('Upload failed', error);
        return EMPTY
      })
    ).subscribe();
  }
}
