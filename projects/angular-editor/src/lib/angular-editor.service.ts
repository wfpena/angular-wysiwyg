import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { CustomClass } from './config';

export interface UploadResponse {
  imageUrl: string;
}

@Injectable()
export class AngularEditorService {
  savedSelection: Range | null;
  selectedText: string;
  uploadUrl?: string;
  uploadWithCredentials?: boolean;
  currentFontName: string;
  currentFontSize: string;

  constructor(
    private http: HttpClient,
    // @ts-ignore
    @Inject(DOCUMENT) private doc: Document,
  ) {}

  /**
   * Executed command from editor header buttons exclude toggleEditorMode
   * @param command string from triggerCommand
   * @param value
   */
  executeCommand(command: string, value?: string) {
    const commands = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'pre'];
    if (commands.includes(command)) {
      this.doc.execCommand('formatBlock', false, command);
      return;
    }
    this.doc.execCommand(command, false, value);
  }

  /**
   * Create URL link
   * @param url string from UI prompt
   */
  createLink(url: string) {
    if (!url.includes('http')) {
      this.doc.execCommand('createlink', false, url);
    } else {
      const newUrl =
        '<a href="' + url + '" target="_blank">' + this.selectedText + '</a>';
      this.insertHtml(newUrl);
    }
  }

  /**
   * insert color either font or background
   *
   * @param color color to be inserted
   * @param where where the color has to be inserted either text/background
   */
  insertColor(color: string, where: string): void {
    const restored = this.restoreSelection();
    if (restored) {
      if (where === 'textColor') {
        this.doc.execCommand('foreColor', false, color);
      } else {
        this.doc.execCommand('hiliteColor', false, color);
      }
    }
  }

  /**
   * Set font name
   * @param fontName string
   */
  setFontName(fontName: string) {
    this.doc.execCommand('fontName', false, fontName);
    this.currentFontName = fontName;
  }

  /**
   * Set font size
   * @param fontSize string
   */
  setFontSize(fontSize: string) {
    this.doc.execCommand('fontSize', false, fontSize);
    this.currentFontSize = fontSize;
  }

  /**
   * Create raw HTML
   * @param html HTML string
   */
  insertHtml(html: string): void {
    const isHTMLInserted = this.doc.execCommand('insertHTML', false, html);

    if (!isHTMLInserted) {
      throw new Error('Unable to perform the operation');
    }
  }

  /**
   * save selection when the editor is focussed out
   */
  public saveSelection = (): void => {
    const sel = this.doc.getSelection() as Selection;
    if (sel) {
      if (sel?.getRangeAt && sel?.rangeCount) {
        this.savedSelection = sel.getRangeAt(0);
        this.selectedText = sel.toString();
      }
    } else if (this.doc['getSelection'] && this.doc['createRange']) {
      this.savedSelection = document.createRange();
    } else {
      this.savedSelection = null;
    }
  };

  /**
   * restore selection when the editor is focused in
   *
   * saved selection when the editor is focused out
   */
  restoreSelection(): boolean | undefined {
    if (this.savedSelection) {
      if (this.doc.getSelection) {
        const sel = this.doc.getSelection() as Selection;
        sel.removeAllRanges();
        sel.addRange(this.savedSelection);
        return true;
      } else if (this.doc['getSelection'] /*&& this.savedSelection.select*/) {
        return true;
      }
    } else {
      return false;
    }
  }

  /**
   * setTimeout used for execute 'saveSelection' method in next event loop iteration
   */
  public executeInNextQueueIteration(
    callbackFn: (...args: any[]) => any,
    timeout = 1e2,
  ): void {
    setTimeout(callbackFn, timeout);
  }

  /**
   * Upload file to uploadUrl
   * @param file The file
   */
  uploadImage(file: File): Observable<HttpEvent<UploadResponse>> | undefined {
    if (this.uploadUrl) {
      const uploadData: FormData = new FormData();
      uploadData.append('file', file, file.name);

      return this.http.post<UploadResponse>(this.uploadUrl, uploadData, {
        reportProgress: true,
        observe: 'events',
        withCredentials: this.uploadWithCredentials,
      });
    }
  }

  /**
   * Insert image with Url
   * @param imageUrl The imageUrl.
   */
  insertImage(imageUrl: string) {
    this.doc.execCommand('insertHTML', false, `<img src="${imageUrl}"/>`);
  }

  setDefaultParagraphSeparator(separator: string) {
    this.doc.execCommand('defaultParagraphSeparator', false, separator);
  }

  createCustomClass(customClass: CustomClass) {
    let newTag = this.selectedText;
    if (customClass) {
      const tagName = customClass.tag ? customClass.tag : 'div';
      if (!this.selectedText) this.selectedText = '&nbsp;';
      newTag +=
        '<' +
        tagName +
        ' class="' +
        customClass.class +
        '">' +
        this.selectedText +
        '</' +
        tagName +
        '>';
    }
    this.insertHtml(newTag);
  }

  insertVideo(videoUrl: string) {
    if (videoUrl.match('www.youtube.com')) {
      this.insertYouTubeVideoTag(videoUrl);
    }
    if (videoUrl.match('vimeo.com')) {
      this.insertVimeoVideoTag(videoUrl);
    }
  }

  private insertYouTubeVideoTag(videoUrl: string): void {
    const id = videoUrl.split('v=')[1];
    const imageUrl = `https://img.youtube.com/vi/${id}/0.jpg`;
    const thumbnail = `
      <div style='position: relative'>
        <a href='${videoUrl}' target='_blank'>
          <img src="${imageUrl}" alt="click to watch"/>
          <img style='position: absolute; left:200px; top:140px'
          src="https://img.icons8.com/color/96/000000/youtube-play.png"/>
        </a>
      </div>`;
    this.insertHtml(thumbnail);
  }

  private insertVimeoVideoTag(videoUrl: string): void {
    const sub = this.http
      .get<any>(`https://vimeo.com/api/oembed.json?url=${videoUrl}`)
      .subscribe((data) => {
        const imageUrl = data.thumbnail_url_with_play_button;
        const thumbnail = `<div>
        <a href='${videoUrl}' target='_blank'>
          <img src="${imageUrl}" alt="${data.title}"/>
        </a>
      </div>`;
        this.insertHtml(thumbnail);
        sub.unsubscribe();
      });
  }

  nextNode(node: any) {
    if (node.hasChildNodes()) {
      return node.firstChild;
    } else {
      while (node && !node.nextSibling) {
        node = node.parentNode;
      }
      if (!node) {
        return null;
      }
      return node.nextSibling;
    }
  }

  getRangeSelectedNodes(range, includePartiallySelectedContainers) {
    let node = range.startContainer;
    const endNode = range.endContainer;
    let rangeNodes = [] as any[];

    // Special case for a range that is contained within a single node
    if (node === endNode) {
      rangeNodes = [node];
    } else {
      // Iterate nodes until we hit the end container
      while (node && node !== endNode) {
        rangeNodes.push((node = this.nextNode(node)));
      }

      // Add partially selected nodes at the start of the range
      node = range.startContainer;
      while (node && node !== range.commonAncestorContainer) {
        rangeNodes.unshift(node);
        node = node.parentNode;
      }
    }

    // Add ancestors of the range container, if required
    if (includePartiallySelectedContainers) {
      node = range.commonAncestorContainer;
      while (node) {
        rangeNodes.push(node);
        node = node.parentNode;
      }
    }

    return rangeNodes;
  }

  getSelectedNodes() {
    const nodes = [] as any[];
    if (this.doc.getSelection) {
      const sel = this.doc.getSelection() as Selection;
      for (let i = 0, len = sel.rangeCount; i < len; ++i) {
        nodes.push.apply(
          nodes,
          this.getRangeSelectedNodes(sel.getRangeAt(i), true),
        );
      }
    }
    return nodes;
  }

  replaceWithOwnChildren(el) {
    const parent = el.parentNode;
    while (el.hasChildNodes()) {
      parent.insertBefore(el.firstChild, el);
    }
    parent.removeChild(el);
  }

  removeSelectedElements(tagNames) {
    const tagNamesArray = tagNames.toLowerCase().split(',');
    this.getSelectedNodes().forEach((node) => {
      if (
        node.nodeType === 1 &&
        tagNamesArray.indexOf(node.tagName.toLowerCase()) > -1
      ) {
        this.replaceWithOwnChildren(node);
      }
    });
  }

  getInnerTextFromNode(node: HTMLElement): string | null {
    if (!node) return null;
    if (node.innerText) {
      return node.innerText;
    }
    const text = [];
    for (let child of Array.from(node.childNodes)) {
      text.push(child.textContent);
    }
    return text.join('');
  }

  getInnerHTMLFromNode(node: HTMLElement): string | null {
    if (!node) return null;
    if (node.innerHTML) {
      return node.innerHTML;
    }
    let combinedInnerHTML = '';
    for (let i = 0; i < node.childNodes.length; i++) {
      const childNode = node.childNodes[i] as HTMLElement;
      if (childNode.nodeType === 1) {
        combinedInnerHTML += childNode.innerHTML;
      }
    }
    return combinedInnerHTML;
  }

  getFirstParentWithProperty(node: any, className: string) {
    if (!node) return null;
    if (node.classList?.contains(className)) {
      return node;
    }
    return this.getFirstParentWithProperty(node.parentNode, className);
  }

  getCurrentSelection() {
    const selection = this.doc.getSelection();
    if (selection && selection.rangeCount > 0) {
      return selection.getRangeAt(0);
    }
    return null;
  }
}
