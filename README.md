# Angular WYSIWYG Text Editor

Rich text editor Whay You See Is What You Get created using Angular 17.

Easy to use and customize.

---

<p align="center" style="font-size: 16px;">
<a href="https://wfpena.github.io/angular-wysiwyg/">📝 <b>DEMO - Try it out! 📝</b></a>
</p>

---

## Installation

Using npm:
> npm install @wfpena/angular-wysiwyg

Using yarn:
> yarn add @wfpena/angular-wysiwyg

## Usage

```js
// Needs to import HttpClientModule
import { HttpClientModule} from '@angular/common/http';
import { AngularEditorModule } from '@wfpena/angular-wysiwyg';

@NgModule({
  imports: [ HttpClientModule, AngularEditorModule ]
})

```

Then you can use the `angular-editor` component like this:

```html
<angular-editor [placeholder]="'Jot something down...'" [(ngModel)]="htmlContent"></angular-editor>
```

You can customize the editor by passing configs through the `[config]` attribute.

```html
<angular-editor id="editor1" [config]="editorConfig"></angular-editor>
<angular-editor id="editor2" [config]="editorConfig"></angular-editor>
```

Also, you can use multiple `angular-editor` components on the same page by passing the `id` property to each.


### Configs:


|Name|Example Value|
|--- |--- |
|customClasses|`[{"name": "quote","class": "quote"}]`|
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

## TODO

