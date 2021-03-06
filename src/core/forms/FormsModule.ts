import { NgModule } from '@angular/core';
import { ErrorsListComponent } from './ErrorsListComponent';
import { TextInputComponent } from './TextInputComponent';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { CKEditorModule } from 'ng2-ckeditor';
import { DropDownInputComponent } from './DropDownInputComponent';
import { CKEInputComponent } from './CKEInputComponent';
import {CustomFormsModule} from 'ng2-validation';

@NgModule({
  declarations: [
    ErrorsListComponent,
    TextInputComponent,
    DropDownInputComponent,
    CKEInputComponent
  ],
  exports: [
    ErrorsListComponent,
    TextInputComponent,
    DropDownInputComponent,
    CKEInputComponent
  ],
  providers: [],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CKEditorModule,
    CustomFormsModule
  ]
})
export class BioFormsModule {

}
