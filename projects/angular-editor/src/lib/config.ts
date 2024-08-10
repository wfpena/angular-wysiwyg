import { UploadResponse } from './angular-editor.service';
import { HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CustomClass {
  name: string;
  class: string;
  tag?: string;
}

export interface Font {
  name: string;
  class: string;
  label?: string;
}

export interface AngularEditorConfig {
  editable?: boolean;
  spellcheck?: boolean;
  height?: 'auto' | string;
  minHeight?: '0' | string;
  maxHeight?: 'auto' | string;
  /**
   * @description background-color property of the editor textarea element
   * @default 'white'
   */
  textAreaBackgroundColor?: string;
  width?: 'auto' | string;
  minWidth?: '0' | string;
  translate?: 'yes' | 'now' | string;
  enableToolbar?: boolean;
  showToolbar?: boolean;
  placeholder?: string;
  defaultParagraphSeparator?: string;
  defaultFontName?: string;
  defaultFontSize?: '1' | '2' | '3' | '4' | '5' | '6' | '7' | string;
  uploadUrl?: string;
  upload?: (file: File) => Observable<HttpEvent<UploadResponse>>;
  uploadWithCredentials?: boolean;
  fonts?: Font[];
  customClasses?: CustomClass[];
  sanitize?: boolean;
  toolbarPosition?: 'top' | 'bottom';
  /**
   * @description show outline on textarea when on focus
   * @default true
   */
  outline?: boolean;
  toolbarHiddenButtons?: string[][];
  rawPaste?: boolean;
  editHistoryLimit?: number;
  /**
   *  @description Number indicating how fast mouse drag will cause image to resize
   *  @default 2
   */
  imageResizeSensitivity?: number;
  /**
   * @description Enable or disable text patter checks example '> ' and '* '
   * @default true
   */
  textPatternsEnabled?: boolean;
}

export const angularEditorConfig: AngularEditorConfig = {
  editable: true,
  spellcheck: true,
  height: 'auto',
  minHeight: '0',
  maxHeight: 'auto',
  textAreaBackgroundColor: 'white',
  width: 'auto',
  minWidth: '0',
  translate: 'yes',
  enableToolbar: true,
  showToolbar: true,
  placeholder: 'Enter text here...',
  defaultParagraphSeparator: '',
  defaultFontName: 'Arial',
  defaultFontSize: '5',
  fonts: [
    { class: 'arial', name: 'Arial' },
    { class: 'times-new-roman', name: 'Times New Roman' },
    { class: 'roboto-condensed-embedded', name: 'Roboto' },
    { class: 'comic-sans-ms', name: 'Comic Sans MS' },
  ],
  // uploadUrl: 'v1/image',
  uploadWithCredentials: false,
  sanitize: true,
  toolbarPosition: 'top',
  outline: true,
  /*toolbarHiddenButtons: [
    ['bold', 'italic', 'underline', 'strikeThrough', 'superscript', 'subscript'],
    ['heading', 'fontName', 'fontSize', 'color'],
    ['justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull', 'indent', 'outdent'],
    ['cut', 'copy', 'delete', 'removeFormat', 'undo', 'redo'],
    ['paragraph', 'blockquote', 'removeBlockquote', 'horizontalLine', 'orderedList', 'unorderedList'],
    ['link', 'unlink', 'image', 'video']
  ]*/
  editHistoryLimit: 50,
  imageResizeSensitivity: 2,
  textPatternsEnabled: true,
};
