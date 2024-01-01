import { DOCUMENT } from '@angular/common';
import {
  AfterViewInit,
  Attribute,
  ChangeDetectorRef,
  Component, ContentChild,
  ElementRef,
  EventEmitter,
  forwardRef,
  HostBinding,
  HostListener,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
  SecurityContext, TemplateRef,
  ViewChild
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { AngularEditorToolbarComponent } from './angular-editor-toolbar.component';
import { AngularEditorService } from './angular-editor.service';
import { AngularEditorConfig, angularEditorConfig } from './config';
import { isDefined } from './utils';
import { Subject, throttleTime } from 'rxjs';

@Component({
  selector: 'angular-editor',
  templateUrl: './angular-editor.component.html',
  styleUrls: ['./angular-editor.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AngularEditorComponent),
      multi: true
    },
    AngularEditorService
  ]
})
export class AngularEditorComponent implements OnInit, ControlValueAccessor, AfterViewInit, OnDestroy {

  private onChange: (value: string) => void;
  private onTouched: () => void;

  modeVisual = true;
  showPlaceholder = false;
  disabled = false;
  focused = false;
  touched = false;
  changed = false;

  mouseMoveEvtListener = () => {};
  currentSelectedImage: any = null;
  editSubject = new Subject();
  editHistory = [];
  currentHistoryIndex = -1;

  focusInstance: any;
  blurInstance: any;

  @Input() id = '';
  @Input() config: AngularEditorConfig = angularEditorConfig;
  @Input() placeholder = '';
  @Input() tabIndex: number | null;

  @Output() html;

  @ViewChild('editor', {static: true}) textArea: ElementRef;
  @ViewChild('editorWrapper', {static: true}) editorWrapper: ElementRef;
  @ViewChild('editorToolbar') editorToolbar: AngularEditorToolbarComponent;
  @ContentChild("customButtons") customButtonsTemplateRef?: TemplateRef<any>;
  executeCommandFn = this.executeCommand.bind(this);

  @Output() viewMode = new EventEmitter<boolean>();

  /** emits `blur` event when focused out from the textarea */
    // eslint-disable-next-line @angular-eslint/no-output-native, @angular-eslint/no-output-rename
  @Output('blur') blurEvent: EventEmitter<FocusEvent> = new EventEmitter<FocusEvent>();

  /** emits `focus` event when focused in to the textarea */
    // eslint-disable-next-line @angular-eslint/no-output-rename, @angular-eslint/no-output-native
  @Output('focus') focusEvent: EventEmitter<FocusEvent> = new EventEmitter<FocusEvent>();

  @HostBinding('attr.tabindex') tabindex = -1;

  @HostListener('focus')
  onFocus() {
    this.focus();
  }

  @HostListener('contextmenu')
  preventContextMenu() {
    this.unselectImage();
  }

  @HostListener('window:click', ['$event.target'])
  onClick(e) {
    if (!this.focused) return;
    this.unselectImage();
    if (!e || e.tagName !== 'IMG') return;
    this.currentSelectedImage = e;
    this.addResizeWrapper();
    this.selectImage();
    this.onContentChange(this.textArea.nativeElement);
  }

  constructor(
    private r: Renderer2,
    private editorService: AngularEditorService,
    @Inject(DOCUMENT) private doc: Document,
    private sanitizer: DomSanitizer,
    private cdRef: ChangeDetectorRef,
    @Attribute('tabindex') defaultTabIndex: string,
    @Attribute('autofocus') private autoFocus: any
  ) {
    const parsedTabIndex = Number(defaultTabIndex);
    this.tabIndex = (parsedTabIndex || parsedTabIndex === 0) ? parsedTabIndex : null;
    this.editSubject
      .pipe(
        throttleTime(200, undefined, { leading: false, trailing: true })
      )
      .subscribe((html) => {
        this.addHistory(html);
      });
  }

  ngOnInit() {
    this.config.toolbarPosition = this.config.toolbarPosition ? this.config.toolbarPosition : angularEditorConfig.toolbarPosition;
    this.config.editHistoryLimit = this.config.editHistoryLimit ? this.config.editHistoryLimit : angularEditorConfig.editHistoryLimit;
    this.config.imageResizeSensitivity = this.config.imageResizeSensitivity ? this.config.imageResizeSensitivity : angularEditorConfig.imageResizeSensitivity;
  }

  ngAfterViewInit() {
    if (isDefined(this.autoFocus)) {
      this.focus();
    }
  }

  ePos;
  resizeImage = (currentSelected, renderer2) => (e) => {
    if (!currentSelected) return;
    const resizeSensitivity = this.config.imageResizeSensitivity || angularEditorConfig.imageResizeSensitivity;
    const dx = this.ePos - e.x;
    this.ePos = e.x;
    let nextWidth = currentSelected.width + (dx * resizeSensitivity);
    if (nextWidth <= 10) nextWidth = 10;
    renderer2.setAttribute(currentSelected, 'width', `${nextWidth}px`);
  }

  selectImage(toStart = false) {
    const selection = this.doc.getSelection();
    selection.removeAllRanges();
    const range = this.doc.createRange();
    range.selectNode(this.currentSelectedImage);
    range.collapse(toStart);
    selection.addRange(range);
    this.r.setStyle(this.textArea.nativeElement, 'caret-color', 'transparent');
  }

  // TODO: Move image stuff to another service or class
  addResizeWrapper() {
    const parent = this.currentSelectedImage.parentNode;
    if (parent.classList?.contains('angular-editor-selected-image-wrapper')) return;
    const wrapper = this.r.createElement('div');
    this.r.addClass(wrapper, 'angular-editor-selected-image-wrapper');
    this.r.insertBefore(parent, wrapper, this.currentSelectedImage);
    this.r.removeChild(parent, this.currentSelectedImage);
    this.r.appendChild(wrapper, this.currentSelectedImage);
    this.r.listen(wrapper, 'mousedown', (e) => {
      e.preventDefault();
      this.mouseMoveEvtListener();
      this.ePos = e.x;
      this.mouseMoveEvtListener = this.r.listen(this.doc, 'mousemove', this.resizeImage(this.currentSelectedImage, this.r));
    });
  }

  removeResizeWrapper() {
    this.mouseMoveEvtListener();
    const wrappers = this.doc.getElementsByClassName('angular-editor-selected-image-wrapper');
    for (let i=wrappers.length-1;i>=0;i--) {
      const wrapper = wrappers[i];
      this.editorService.replaceWithOwnChildren(wrapper);
    }
  }

  unselectImage() {
    this.removeResizeWrapper();
    if (!this.currentSelectedImage) return;
    this.r.removeClass(this.currentSelectedImage, 'angular-editor-selected-image');
    this.currentSelectedImage = null;
    this.onContentChange(this.textArea.nativeElement);
    this.r.setStyle(this.textArea.nativeElement, 'caret-color', 'black');
  }

  onPaste(event: ClipboardEvent){
    if (this.config.rawPaste) {
      event.preventDefault();
      const text = event.clipboardData.getData('text/plain');
      document.execCommand('insertHTML', false, text);
      return text;
    }
  }

  setContentAsCode(editableElement) {
    const oContent = this.r.createText(editableElement.innerHTML);
    this.r.setProperty(editableElement, 'innerHTML', '');
    this.r.setProperty(editableElement, 'contentEditable', false);

    const oPre = this.r.createElement('pre');
    this.r.setStyle(oPre, 'margin', '0');
    this.r.setStyle(oPre, 'outline', 'none');

    const oCode = this.r.createElement('code');
    this.r.setProperty(oCode, 'id', 'sourceText' + this.id);
    this.r.setStyle(oCode, 'display', 'block');
    this.r.setStyle(oCode, 'white-space', 'pre-wrap');
    this.r.setStyle(oCode, 'word-break', 'keep-all');
    this.r.setStyle(oCode, 'outline', 'none');
    this.r.setStyle(oCode, 'margin', '0');
    this.r.setStyle(oCode, 'background-color', '#fff5b9');
    this.r.setProperty(oCode, 'contentEditable', true);
    this.r.appendChild(oCode, oContent);
    this.focusInstance = this.r.listen(oCode, 'focus', (event) => this.onTextAreaFocus(event));
    this.blurInstance = this.r.listen(oCode, 'blur', (event) => this.onTextAreaBlur(event));
    this.r.appendChild(oPre, oCode);
    this.r.appendChild(editableElement, oPre);

    this.doc.execCommand('defaultParagraphSeparator', false, 'div');
  }

  setElementState() {
    const state = this.editHistory[this.currentHistoryIndex];
    this.r.setProperty(this.textArea.nativeElement, 'innerHTML', state);
    if (!this.modeVisual) {
      this.setContentAsCode(this.textArea.nativeElement);
    }
  }

  ctrlZ(e) {
    if (this.currentSelectedImage) {
      this.unselectImage();
    }
  }

  ctrlShiftZ(e) {
    if (this.currentSelectedImage) {
      this.unselectImage();
    }
  }

  undo() {
    if (this.editHistory.length < 1 || this.currentHistoryIndex <= 0) return;
    this.currentHistoryIndex -= 1;
    this.setElementState();
    this.onContentChange(this.textArea.nativeElement, false);
  }

  redo() {
    if (this.currentHistoryIndex >= this.editHistory.length - 1) return;
    this.currentHistoryIndex += 1;
    this.setElementState();
    this.onContentChange(this.textArea.nativeElement, false);
  }

  handleEnter(e) {
    const sel = this.doc.getSelection();
    const focusNode = sel.focusNode as Node & HTMLElement & any;
    if (focusNode && focusNode.previousSibling && focusNode.classList?.contains('quote')) {
      if (focusNode.innerHTML === '<br>' && focusNode.previousSibling.innerHTML === '<br>') {
        this.editorService.replaceWithOwnChildren(focusNode.previousSibling);
        this.editorService.replaceWithOwnChildren(focusNode);
        this.onContentChange(this.textArea.nativeElement, false);
      }
    }
  }

  /**
   * Executed command from editor header buttons
   * @param command string from triggerCommand
   * @param value
   */
  executeCommand(command: string, value?: string) {
    this.focus();
    if (command === 'focus') {
      return;
    }
    // TODO: Undo / Redo image resize 
    // if (this.currentSelectedImage) {
    //   this.unselectImage();
    //   if (command === 'undo') {
    //     // this.unselectImage();
    //     this.undo();
    //     return;
    //   }
    //   if (command === 'redo') {
    //     // this.unselectImage();
    //     this.redo();
    //     return;
    //   }
    // }
    
    if (command === 'toggleEditorMode') {
      this.toggleEditorMode(this.modeVisual);
    } else if (command !== '') {
      if (command === 'clear') {
        this.editorService.removeSelectedElements(this.getCustomTags());
        this.onContentChange(this.textArea.nativeElement);
      } else if (command === 'default') {
        this.editorService.removeSelectedElements('h1,h2,h3,h4,h5,h6,p,pre');
        this.onContentChange(this.textArea.nativeElement);
      } else {
        this.editorService.executeCommand(command, value);
      }
      this.exec();
    }
  }

  onTextAreaFocus(event: FocusEvent): void {
    if (this.focused) {
      event.stopPropagation();
      return;
    }
    this.focused = true;
    this.focusEvent.emit(event);
    if (!this.touched || !this.changed) {
      this.editorService.executeInNextQueueIteration(() => {
        this.configure();
        this.touched = true;
      });
    }
  }

  /**
   * @description fires when cursor leaves textarea
   */
  public onTextAreaMouseOut(event: MouseEvent): void {
    this.editorService.saveSelection();
  }

  onTextAreaBlur(event: FocusEvent) {
    this.unselectImage();
    this.editorService.executeInNextQueueIteration(this.editorService.saveSelection);

    if (typeof this.onTouched === 'function') {
      this.onTouched();
    }

    if (event.relatedTarget !== null) {
      const parent = (event.relatedTarget as HTMLElement).parentElement;
      if (!parent.classList.contains('angular-editor-toolbar-set') && !parent.classList.contains('ae-picker')) {
        this.blurEvent.emit(event);
        this.focused = false;
      }
    }
  }

  /**
   *  focus the text area when the editor is focused
   */
  focus() {
    if (this.modeVisual) {
      this.textArea.nativeElement.focus();
    } else {
      const sourceText = this.doc.getElementById('sourceText' + this.id);
      sourceText.focus();
      this.focused = true;
    }
  }

  addHistory(html) {
    if (this.editHistory.length >= this.config.editHistoryLimit) {
      this.editHistory.shift();
      this.currentHistoryIndex -= 1;
    }
    this.editHistory.length = this.currentHistoryIndex + 1;
    this.editHistory.push(html);
    this.currentHistoryIndex = this.editHistory.length - 1;
  }

  /**
   * Executed from the contenteditable section while the input property changes
   * @param element html element from contenteditable
   */
  onContentChange(element: any, addChangeToHistory = true): void {
    let html = '';
    if (this.modeVisual) {
      html = element.innerHTML;
    } else {
      html = element.innerText;
    }
    if ((!html || html === '<br>')) {
      html = '';
    }
    if (typeof this.onChange === 'function') {
      this.onChange(this.config.sanitize || this.config.sanitize === undefined ? this.sanitizer.sanitize(SecurityContext.HTML, html) : html);
      if ((!html) !== this.showPlaceholder) {
        this.togglePlaceholder(this.showPlaceholder);
      }
    }
    if (addChangeToHistory) {
      this.editSubject.next(html);
    }
    this.changed = true;
  }

  /**
   * Set the function to be called
   * when the control receives a change event.
   *
   * @param fn a function
   */
  registerOnChange(fn: any): void {
    this.onChange = e => (e === '<br>' ? fn('') : fn(e)) ;
  }

  /**
   * Set the function to be called
   * when the control receives a touch event.
   *
   * @param fn a function
   */
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  /**
   * Write a new value to the element.
   *
   * @param value value to be executed when there is a change in contenteditable
   */
  writeValue(value: any): void {

    if ((!value || value === '<br>' || value === '') !== this.showPlaceholder) {
      this.togglePlaceholder(this.showPlaceholder);
    }

    if (value === undefined || value === '' || value === '<br>') {
      value = null;
    }

    this.refreshView(value);
  }

  /**
   * refresh view/HTML of the editor
   *
   * @param value html string from the editor
   */
  refreshView(value: string): void {
    const normalizedValue = value === null ? '' : value;
    this.r.setProperty(this.textArea.nativeElement, 'innerHTML', normalizedValue);
    if (value !== null && this.editHistory.length === 0) {
      this.editHistory.push(this.textArea.nativeElement.innerHTML);
      this.currentHistoryIndex = 0;
    }

    return;
  }

  /**
   * toggles placeholder based on input string
   *
   * @param value A HTML string from the editor
   */
  togglePlaceholder(value: boolean): void {
    if (!value) {
      this.r.addClass(this.editorWrapper.nativeElement, 'show-placeholder');
      this.showPlaceholder = true;

    } else {
      this.r.removeClass(this.editorWrapper.nativeElement, 'show-placeholder');
      this.showPlaceholder = false;
    }
  }

  /**
   * Implements disabled state for this element
   *
   * @param isDisabled Disabled flag
   */
  setDisabledState(isDisabled: boolean): void {
    const div = this.textArea.nativeElement;
    const action = isDisabled ? 'addClass' : 'removeClass';
    this.r[action](div, 'disabled');
    this.disabled = isDisabled;
  }

  /**
   * toggles editor mode based on bToSource bool
   *
   * @param bToSource A boolean value from the editor
   */
  toggleEditorMode(bToSource: boolean) {
    let oContent: any;
    const editableElement = this.textArea.nativeElement;

    if (bToSource) {
      oContent = this.r.createText(editableElement.innerHTML);
      this.r.setProperty(editableElement, 'innerHTML', '');
      this.r.setProperty(editableElement, 'contentEditable', false);

      const oPre = this.r.createElement('pre');
      this.r.setStyle(oPre, 'margin', '0');
      this.r.setStyle(oPre, 'outline', 'none');

      const oCode = this.r.createElement('code');
      this.r.setProperty(oCode, 'id', 'sourceText' + this.id);
      this.r.setStyle(oCode, 'display', 'block');
      this.r.setStyle(oCode, 'white-space', 'pre-wrap');
      this.r.setStyle(oCode, 'word-break', 'keep-all');
      this.r.setStyle(oCode, 'outline', 'none');
      this.r.setStyle(oCode, 'margin', '0');
      this.r.setStyle(oCode, 'background-color', '#fff5b9');
      this.r.setProperty(oCode, 'contentEditable', true);
      this.r.appendChild(oCode, oContent);
      this.focusInstance = this.r.listen(oCode, 'focus', (event) => this.onTextAreaFocus(event));
      this.blurInstance = this.r.listen(oCode, 'blur', (event) => this.onTextAreaBlur(event));
      this.r.appendChild(oPre, oCode);
      this.r.appendChild(editableElement, oPre);

      // ToDo move to service
      this.doc.execCommand('defaultParagraphSeparator', false, 'div');

      this.modeVisual = false;
      this.viewMode.emit(false);
      oCode.focus();
    } else {
      if (this.doc.querySelectorAll) {
        this.r.setProperty(editableElement, 'innerHTML', editableElement.innerText);
      } else {
        oContent = this.doc.createRange();
        oContent.selectNodeContents(editableElement.firstChild);
        this.r.setProperty(editableElement, 'innerHTML', oContent.toString());
      }
      this.r.setProperty(editableElement, 'contentEditable', true);
      this.modeVisual = true;
      this.viewMode.emit(true);
      this.onContentChange(editableElement, false);
      editableElement.focus();
    }
    this.editorToolbar.setEditorMode(!this.modeVisual);
  }

  textPatternCheck() {
    if (!this.modeVisual) return;
    const selection = this.doc.getSelection();
    const txtData = selection.anchorNode.textContent;
    const textPatternsMap = {
      '1.': { command: 'insertOrderedList', offsets: [3], },
      '*': { command: 'insertUnorderedList', offsets: [2], },
      '>': { command: () => this.editorService.createCustomClass({ name:'quote', class: 'quote' }), offsets: [2], },
    };
    const patternDetected = textPatternsMap[txtData.trim()];
    if (patternDetected && 
      patternDetected.command && 
      patternDetected.offsets?.includes(selection.anchorOffset)
    ) {
      if (typeof patternDetected.command == 'string') {
        this.doc.execCommand(patternDetected.command, false);
        const edRange = selection.getRangeAt(0);
        const edNode = edRange.commonAncestorContainer;
        selection.removeAllRanges();
        const range = this.doc.createRange();
        range.selectNodeContents(edNode);
        selection.addRange(range);
        range.deleteContents();
      } else {
        const edRange = selection.getRangeAt(0);
        const edNode = edRange.commonAncestorContainer;
        selection.removeAllRanges();
        const range = this.doc.createRange();
        range.selectNodeContents(edNode);
        selection.addRange(range);
        patternDetected.command();
      }
    }
  }

  /**
   * toggles editor buttons when cursor moved or positioning
   *
   * Send a node array from the contentEditable of the editor
   */
  exec($event = null) {
    if ($event && ($event.key === 'Delete' || $event.key === 'Backspace')) {
      if (this.currentSelectedImage) {
        this.onContentChange(this.textArea.nativeElement);
        this.removeResizeWrapper();
        if ($event.key === 'Delete') {
          this.selectImage(true);
        }
      }
    }
    this.editorToolbar.triggerButtons();

    let userSelection;
    if (this.doc.getSelection) {
      userSelection = this.doc.getSelection();
      this.editorService.executeInNextQueueIteration(this.editorService.saveSelection);
    }

    let a = userSelection.focusNode;
    const els = [];
    while (a && a.id !== 'editor') {
      els.unshift(a);
      a = a.parentNode;
    }
    this.editorToolbar.triggerBlocks(els);
    if ($event && $event.type === 'keyup' && $event.key === ' ') {
      this.textPatternCheck();
    }
  }

  private configure() {
    this.editorService.uploadUrl = this.config.uploadUrl;
    this.editorService.uploadWithCredentials = this.config.uploadWithCredentials;
    if (this.config.defaultParagraphSeparator) {
      this.editorService.setDefaultParagraphSeparator(this.config.defaultParagraphSeparator);
    }
    if (this.config.defaultFontName) {
      this.editorService.setFontName(this.config.defaultFontName);
    }
    if (this.config.defaultFontSize) {
      this.editorService.setFontSize(this.config.defaultFontSize);
    }
  }

  getFonts() {
    const fonts = this.config.fonts ? this.config.fonts : angularEditorConfig.fonts;
    return fonts.map(x => {
      return {label: x.name, value: x.name};
    });
  }

  getCustomTags() {
    const tags = ['span'];
    this.config.customClasses.forEach(x => {
      if (x.tag !== undefined) {
        if (!tags.includes(x.tag)) {
          tags.push(x.tag);
        }
      }
    });
    return tags.join(',');
  }

  ngOnDestroy() {
    if (this.blurInstance) {
      this.blurInstance();
    }
    if (this.focusInstance) {
      this.focusInstance();
    }
  }

  filterStyles(html: string): string {
    html = html.replace('position: fixed;', '');
    return html;
  }
}
