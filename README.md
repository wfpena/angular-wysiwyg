<p align="center">
  <img width="150px" src="projects\angular-editor-app\src\assets\angular-wysiwyg-logo2.PNG" alt="AngularEditor logo"/>
</p>

# Angular WYSIWYG Text Editor

Rich text editor Whay You See Is What You Get created using Angular 17.

Easy to use and customize.

---

<p align="center" style="font-size: 16px;">
<a href="https://wfpena.github.io/angular-wysiwyg/">📝 <b>DEMO - Try it out! 📝</b></a>
</p>

---

<p align="center">
  <img width="800px" src="projects\angular-editor-app\src\assets\wysiwyg-demo-1.gif" alt="AngularEditor logo"/>
</p>

# Getting Started

## Installation


> :warning:
> For version >=1.0.7 its a requirement to use node version >=18.18.2 because of the `eslint` dependencies.

Using npm:
> npm install @wfpena/angular-wysiwyg

Using yarn:
> yarn add @wfpena/angular-wysiwyg

## Usage

Import module:

> :info:
> Requires `HttpClientModule` for the image upload.

```js
// Needs to import HttpClientModule
import { HttpClientModule} from '@angular/common/http';
import { AngularEditorModule } from '@wfpena/angular-wysiwyg';

@NgModule({
  imports: [ HttpClientModule, AngularEditorModule ]
})

```

You can use the `angular-editor` component. Like this:

```html
<angular-editor [placeholder]="'Jot something down...'" [(ngModel)]="htmlContent"></angular-editor>
```

You can add an `id` attribute if you are going to use the same element multiple times.

You can customize the editor by passing configs through the `[config]` attribute.

Like this:

```html
<angular-editor id="editor1" [config]="editorConfig"></angular-editor>
<angular-editor id="editor2" [config]="editorConfig"></angular-editor>
```

Whe using multiple `angular-editor` components, add a unique `id` property to the component.


### Adding Images:

By default if you click on the image icon and select an image it will be inserted as `base64` string on the `img src=` attribute.

You can copy and paste external images if you want to add them also.

You can define backend endpoints to save the image or directly send the url of the image which should be passed to the `img` element.

You can define the `uploadUrl` config to make a request to the backend to insert the image.

```typescript
config: AngularEditorConfig = {
  uploadUrl: 'http://localhost:9000/upload_img',
  // ...
};
```

You can also define the `upload` config to make the request and map the response into a url to be inserted on the HTML on the editor.


```typescript
import { HttpClient, HttpResponse } from '@angular/common/http';
import { UploadResponse, AngularEditorConfig } from '@wfpena/angular-wysiwyg';
import { map } from 'rxjs';

// ...

export class AppComponent implements OnInit {
  constructor(
    // ...
    private http: HttpClient,
  ) {}

  config: AngularEditorConfig = {
    // ...
    upload: (file) => {
      const url = 'http://localhost:9000/upload_img';
      const uploadData: FormData = new FormData();
      uploadData.append('file', file, file.name);
      return this.http
        .post<{ file: string; url: string }>(url, uploadData, {
          observe: 'response',
        })
        .pipe(
          map((response) => {
            const imageUrl = response.body.url;
            return {
              ...response,
              body: { imageUrl },
            } as HttpResponse<UploadResponse>;
          }),
        );
    },
    // ...
  };
  // ...
}
```


### Image resize

One of the main features of this project is image resizing option.

You can drag the image to make it bigger or smaller, set max and min sizes through config, etc.

The `imageResizeSensitivity` config (default `2`) defines how fast the image will resize based on the mouse move.


### Custom Buttons

You have the flexibility to define custom buttons with specific actions using the ``executeCommandFn``. This function accepts commands from execCommand, where the first argument is ``aCommandName``, and the second argument is ``aValueArgument``.

In the example below, a custom button is created that adds the Angular Editor logo into the editor:

```html

<angular-editor id="editor1" formControlName="htmlContent1" [config]="editorConfig">
  <ng-template #customButtons let-executeCommandFn="executeCommandFn">
    <ae-toolbar-set>
      <ae-button 
        iconClass="fa fa-html5" 
        title="Insert Angular Editor Logo" 
        (buttonClick)="executeCommandFn('insertHtml', angularEditorLogo)">
      </ae-button>
    </ae-toolbar-set>
  </ng-template>
</angular-editor>
```

Feel free to customize the ``iconClass``, ``title``, and ``buttonClick`` event according to your requirements.

### Configs:


|Name|Example Value|
|--- |--- |
|customClasses|`[{"name": "quote","class": "angular-editor-quote"}]`|
|defaultFontName||
|defaultFontSize|5|
|defaultParagraphSeparator||
|editHistoryLimit|50|
|editable|true|
|enableToolbar|true|
|fonts|`[{"class": "arial","name": "Arial"},{"class": "times-new-roman","name": "Times New Roman"},{"class": "calibri","name": "Calibri"},{"class": "comic-sans-ms","name": "Comic Sans MS"}]`|
|height|auto|
|imageResizeSensitivity|2|
|maxHeight|auto|
|minHeight|0|
|minWidth|0|
|outline|true|
|placeholder|Enter text here...|
|sanitize|true|
|showToolbar|true|
|spellcheck|true|
|textAreaBackgroundColor|white|
|toolbarPosition|top|
|translate|yes|
|uploadWithCredentials|false|
|width|auto|

## Report Issues and Feature ideas

You can help make this project better by submitting issues and feature ideas on the [repo issues page](https://github.com/wfpena/angular-wysiwyg/issues).

