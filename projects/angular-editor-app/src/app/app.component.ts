import { HttpClient, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularEditorConfig, UploadResponse } from 'projects/angular-editor/src/public-api';
// import { AngularEditorConfig, UploadResponse } from 'angular-editor';
import { map } from 'rxjs';

// TODO: Change this:
const ANGULAR_EDITOR_LOGO_URL = 'https://raw.githubusercontent.com/wfpena/angular-editor/master/docs/angular-editor-logo.png?raw=true'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'app';

  form: FormGroup;

  htmlContent1 = '';
  htmlContent2 = '';
  angularEditorLogo = `<img alt="angular editor logo" src="${ANGULAR_EDITOR_LOGO_URL}">`;

  config1: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    minHeight: '8rem',
    // maxHeight: '15rem',
    textAreaBackgroundColor: 'white',
    placeholder: 'Enter text here...',
    translate: 'no',
    sanitize: false,
    // toolbarPosition: 'top',
    defaultFontName: 'Comic Sans MS',
    defaultFontSize: '5',
    // showToolbar: false,
    // defaultParagraphSeparator: 'p',
    customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
    uploadUrl: 'http://localhost:9000/upload_img',
    upload: (file) => {
      const url = 'http://localhost:9000/upload_img';
      const uploadData: FormData = new FormData();
      uploadData.append('file', file, file.name);
      return this.http.post<{file:string, url: string}>(url, uploadData, {
        // reportProgress: true,
        observe: 'response',
        // withCredentials: this.uploadWithCredentials,
      })
      .pipe(
        map(response => {
          const imageUrl = response.body.url;
          return { ...response, body: { imageUrl }} as HttpResponse<UploadResponse>;
        })
      );
    },
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
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ]
  };

  constructor(private formBuilder: FormBuilder, private http: HttpClient) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      signature: ['', Validators.required]
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
}
