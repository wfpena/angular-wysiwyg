import { HttpClient, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  AngularEditorConfig,
  UploadResponse,
  angularEditorConfig,
} from '../../../angular-editor/src/public-api';
// } from 'angular-editor';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'angular-wysiwyg-app';

  form: FormGroup;

  htmlContent1 = '';
  htmlContent2 = '';
  angularEditorLogo = `<img alt="angular editor logo" src="data:image/png;base64,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">`;
  htmlContent3 = '';

  config1: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    minHeight: '8rem',
    minWidth: '160px',
    // maxHeight: '15rem',
    textAreaBackgroundColor: 'white',
    placeholder: 'Enter text here...',
    translate: 'no',
    sanitize: false,
    // toolbarPosition: 'top',
    defaultFontName: 'Comic Neue',
    // defaultFontName: 'RobotoSlab',
    defaultFontSize: '5',
    fonts: [
      ...angularEditorConfig.fonts,
      { class: 'roboto-slab', name: 'RobotoSlab', label: 'Roboto Custom' },
    ],
    // showToolbar: false,
    // defaultParagraphSeparator: 'p',
    customClasses: [
      {
        name: 'quote',
        class: 'angular-editor-quote',
      },
      {
        name: 'redText',
        class: 'redText',
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
    // uploadUrl: 'http://localhost:9000/upload_img',
    // upload: (file) => {
    //   const url = 'http://localhost:9000/upload_img';
    //   const uploadData: FormData = new FormData();
    //   uploadData.append('file', file, file.name);
    //   return this.http.post<{file:string, url: string}>(url, uploadData, {
    //     // reportProgress: true,
    //     observe: 'response',
    //     // withCredentials: this.uploadWithCredentials,
    //   })
    //   .pipe(
    //     map(response => {
    //       const imageUrl = response.body.url;
    //       return { ...response, body: { imageUrl }} as HttpResponse<UploadResponse>;
    //     })
    //   );
    // },
    editHistoryLimit: 3,
    imageResizeSensitivity: 2,
    // toolbarHiddenButtons: [
    //   ['bold', 'italic'],
    //   ['fontSize']
    // ]
  };

  config2: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    minHeight: '5rem',
    maxHeight: '15rem',
    placeholder: 'Enter text here...',
    translate: 'no',
    sanitize: true,
    toolbarPosition: 'bottom',
    defaultFontName: 'Comic Sans MS',
    defaultFontSize: '5',
    defaultParagraphSeparator: 'p',
    customClasses: [
      {
        name: 'quote',
        class: 'angular-editor-quote',
      },
      {
        name: 'redText',
        class: 'redText',
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
  };

  config3: AngularEditorConfig = {
    ...this.config1,
    ...angularEditorConfig,
  };

  config4: AngularEditorConfig = {
    ...this.config1,
    ...angularEditorConfig,
    minHeight: '150px',
  };

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
  ) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      signature: ['', Validators.required],
    });
  }

  onChange(event) {
    console.log('changed');
  }

  onBlur(event) {
    console.log('blur ' + event);
  }

  onChange2(event) {
    console.warn(this.form.value);
  }

  onChange3(event) {}

  isObject(val: any): boolean {
    return this.getTypeofVariable(val) === 'object';
  }

  getTypeofVariable(value: any) {
    return typeof value;
  }
}
