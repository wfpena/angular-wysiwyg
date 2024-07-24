// TODO: Organize e2e tests
describe('General tests', () => {
  it('Visits the initial project page', () => {
    cy.visit('/');
    cy.contains('Basic Example with HTML Output');
  });

  it('Checks for text pattern and insert quote - case 1', () => {
    cy.visit('/');
    const editor1 = cy.get('#editor1');
    editor1.click();
    editor1.type('> ');
    const editor1HTMLContent = cy.get('#html-content-editor1');
    editor1HTMLContent
      .invoke('text')
      .should('contain', '<div class="angular-editor-quote">');
  });

  it('Should apply italic command on highlighted text', () => {
    cy.visit('/');
    const editor1Chain = cy.get('#editor1');
    editor1Chain.click();
    editor1Chain.type('> Hello World');
    editor1Chain.scrollIntoView();
    const quoteChain = cy.get('.angular-editor-quote > font');
    const selectedTextChain = quoteChain.selectText(0, 12, true);
    selectedTextChain.should('have.string', 'Hello World');
    cy.window()
      .then((win) => win.getSelection().toString().trim())
      .should('equal', 'Hello World');
    const italicBtnChain = cy.get('.fa.fa-italic').first();
    italicBtnChain.click();
    const editor1HTMLContentChain = cy.get('#html-content-editor1');
    editor1HTMLContentChain.should(
      'contain.text',
      '<font face="Comic Sans MS" size="5"><i>Hello World</i>',
    );
  });

  it('Should change font name and maintain it correctly', () => {
    cy.visit('/');
    const editor1Chain = cy.get('#editor1');
    editor1Chain.focus();
    editor1Chain.click();
    editor1Chain.type('> Hello World');
    const quoteChain = cy.get('.angular-editor-quote > font');
    const selectedTextChain = quoteChain.selectText(0, 12, true);
    selectedTextChain.should('have.string', 'Hello World');
    cy.window()
      .then((win) => win.getSelection().toString().trim())
      .should('equal', 'Hello World');
    const italicBtnChain = cy.get('.fa.fa-italic').first();
    italicBtnChain.click();
    const editor1HTMLContentChain = cy.get('#html-content-editor1');
    editor1HTMLContentChain.should(
      'contain.text',
      '<font face="Comic Sans MS" size="5"><i>Hello World</i>',
    );
    cy.get('.ae-picker-label').eq(1).click();
    cy.get(
      '#editor1 > div > angular-editor-toolbar > div > div:nth-child(7) > ae-select > span > span > button:nth-child(2)',
    )
      .first()
      .click();
    cy.get('#html-content-editor1').should(
      'contain.text',
      '<font size="5" face="Times New Roman"><i',
    );
    cy.get('#html-content-editor1').should(
      'contain.text',
      '>Hello World</i></font></div>',
    );
    cy.window().then((win) => win.getSelection().removeAllRanges());
    cy.get('#editor1').focus().click().type('{enter}{enter}');
    cy.get('#html-content-editor1').should(
      'contain.text',
      '<font size="5" face="Times New Roman"><i',
    );
    cy.get('#html-content-editor1').should(
      'contain.text',
      '>Hello World</i></font></div><font size="5" face="Times New Roman"><i',
    );
    cy.get('#html-content-editor1').should(
      'contain.text',
      '>Hello World</i></font></div><font size="5" face="Times New Roman"><i',
    );
    cy.get('#html-content-editor1').should(
      'contain.text',
      '><br></i></font><font size="5" face="Times New Roman"><i',
    );
    cy.get('#html-content-editor1').should('contain.text', '><br></i></font>');
    cy.get('.angular-editor-wrapper').first().selectText(0, 0, true);
    cy.get('.ae-picker-label').eq(1).click();
    cy.get(
      '#editor1 > div > angular-editor-toolbar > div > div:nth-child(7) > ae-select > span > span > button:nth-child(1)',
    )
      .first()
      .click();
    cy.get('#html-content-editor1').should('contain.text', '<i');
    cy.get('#html-content-editor1').should(
      'contain.text',
      '>Hello World</i></font></font></div><font size="5" face="Arial"><i',
    );
    cy.get('#html-content-editor1').should(
      'contain.text',
      '><br></i></font><font size="5" face="Times New Roman"><i',
    );
    cy.get('#html-content-editor1').should('contain.text', '><br></i></font>');
  });

  it('Should undo italic command on highlighted text', () => {
    cy.visit('/');
    const editor1Chain = cy.get('#editor1');
    editor1Chain.click();
    editor1Chain.type('> Hello World');
    editor1Chain.scrollIntoView();
    let quoteChain = cy.get('.angular-editor-quote > font');
    let selectedTextChain = quoteChain.selectText(0, 12, true);
    selectedTextChain.should('have.string', 'Hello World');
    cy.window()
      .then((win) => win.getSelection().toString().trim())
      .should('equal', 'Hello World');
    let italicBtnChain = cy.get('.fa.fa-italic').first();
    italicBtnChain.click();
    let editor1HTMLContentChain = cy.get('#html-content-editor1');
    editor1HTMLContentChain.should('contain.text', '<i>Hello World</i>');
    quoteChain = cy.get('.angular-editor-quote>font>i');
    selectedTextChain = quoteChain.selectText(2, 10);
    selectedTextChain.should('eq', 'llo Worl');
    italicBtnChain = cy.get('.fa.fa-italic').first();
    italicBtnChain.click();
    editor1HTMLContentChain = cy.get('#html-content-editor1');
    editor1HTMLContentChain.should(
      'contain.text',
      '<font face="Comic Sans MS" size="5"><i',
    );
    editor1HTMLContentChain.should('contain.text', '>He</i>llo Worl<i>d</i>');
  });

  it('Checks for text pattern and insert quote', () => {
    cy.visit('/');
    const editor1 = cy.get('#editor1');
    editor1.click();
    editor1.type('> Hello World');
    const editor1HTMLContent = cy.get('#html-content-editor1');
    editor1HTMLContent.should(
      'contain.text',
      '<div class="angular-editor-quote">',
    );
    editor1HTMLContent.should(
      'contain.text',
      '<font face="Comic Sans MS" size="5">Hello World</font></div>',
    );
  });

  it('Should revert back to character on undo button press', () => {
    cy.visit('/');
    const editor1 = cy.get('#editor1');
    editor1.click();
    editor1.type('> ');
    const undoBtn = cy.get('.fa.fa-undo').first();
    undoBtn.click();
    const editor1HTMLContent = cy.get('#html-content-editor1');
    editor1HTMLContent.should(
      'not.have.text',
      '<div class="angular-editor-quote">',
    );
    editor1HTMLContent.invoke('text').should('contain', '&gt;');
  });

  it('Should revert back to character on undo command called', () => {
    cy.visit('/');
    const editor1 = cy.get('#editor1').get('.angular-editor-textarea').first();
    editor1.click();
    editor1.type('> ');
    const editor1HTMLContent = cy.get('#html-content-editor1');
    editor1HTMLContent
      .invoke('text')
      .should('contain', '<div class="angular-editor-quote">');
    cy.document().invoke('execCommand', 'undo', false);
    cy.get('#html-content-editor1').invoke('text').should('contain', '&gt;');
    cy.document().invoke('execCommand', 'redo', false);
    cy.get('#html-content-editor1')
      .invoke('text')
      .should('contain', '<div class="angular-editor-quote">');
    editor1.type('{enter}');
    cy.get('#html-content-editor1').then((t) =>
      expect(t.text()).to.match(/<br>$/),
    );
    editor1.type('{enter}{enter}');
    cy.get('#html-content-editor1').then((t) =>
      expect(t.text()).to.match(/<div><br><\/div>$/),
    );
  });

  it('Should revert back to character on undo command called also on multiple editors', () => {
    cy.visit('/');
    const editor2Chain = cy
      .get(
        'body > app-root > div.container > form > angular-editor > div > div > div',
      )
      .first();
    editor2Chain.click();
    editor2Chain.type('> ');
    const editor2ContentChain = cy.get('#html-content-editor2');
    editor2ContentChain
      .invoke('text')
      .should('contain', '<div class="angular-editor-quote">');
    cy.document().invoke('execCommand', 'undo', false);
    cy.get('#html-content-editor2').invoke('text').should('contain', '&gt;');
    cy.document().invoke('execCommand', 'redo', false);
    cy.get('#html-content-editor2')
      .invoke('text')
      .should('contain', '<div class="angular-editor-quote">');
    editor2Chain.type('{enter}');
    cy.get('#html-content-editor2').then((t) =>
      expect(t.text()).to.match(/<br>$/),
    );
    editor2Chain.type('{enter}{enter}');
    cy.get('#html-content-editor2').then((t) =>
      expect(t.text()).to.match(/<p><br><\/p>$/),
    );
  });

  it('Should add image and select it on click and unselect on outside click', () => {
    cy.visit('/');
    cy.get('.fa.fa-image')
      .first()
      .should('have.prop', 'tagName')
      .should('eq', 'I');
    cy.get('.fa.fa-image')
      .first()
      .parent()
      .should('have.prop', 'tagName')
      .should('eq', 'BUTTON');
    cy.get('.fa.fa-image').first().parent().click({ force: true });
    cy.get('input[type=file]').first().invoke('css', 'display', 'block');
    cy.get('input[type=file]')
      .first()
      .selectFile([
        {
          contents:
            './projects/angular-editor-app/src/assets/angular-wysiwyg-logo2.PNG',
        },
      ]);
    cy.get('input[type=file]').first().invoke('css', 'display', 'none');
    cy.get('#html-content-editor1').should(
      'contain.text',
      '<img src="data:image/png;base64,iVBORw0KGgoAAA',
    );
    cy.get('.angular-editor-textarea>img').first().should('exist');
    cy.get('.angular-editor-textarea>img').first().should('have.attr', 'src');
    cy.get('.angular-editor-textarea>img').first().click();
    cy.get('.angular-editor-selected-image-wrapper')
      .first()
      .should('have.class', 'angular-editor-selected-image-wrapper')
      .should('exist');
    cy.get('.header-title').click();
    cy.get('.angular-editor-selected-image-wrapper').should('not.exist');
  });

  it('Should add image and resize image', () => {
    cy.visit('/');
    cy.get('.fa.fa-image')
      .first()
      .should('have.prop', 'tagName')
      .should('eq', 'I');
    cy.get('.fa.fa-image')
      .first()
      .parent()
      .should('have.prop', 'tagName')
      .should('eq', 'BUTTON');
    cy.get('.fa.fa-image').first().parent().click({ force: true });
    cy.get('input[type=file]').first().invoke('css', 'display', 'block');
    cy.get('input[type=file]')
      .first()
      .selectFile([
        {
          contents:
            './projects/angular-editor-app/src/assets/angular-wysiwyg-logo2.PNG',
        },
      ]);
    cy.get('input[type=file]').first().invoke('css', 'display', 'none');
    cy.get('#html-content-editor1').should(
      'contain.text',
      '<img src="data:image/png;base64,iVBORw0KGgoAAA',
    );
    cy.get('.angular-editor-textarea img').first().should('exist');
    cy.get('.angular-editor-textarea img').first().should('have.attr', 'src');
    cy.get('.angular-editor-textarea img').first().click();
    cy.get('.angular-editor-textarea img').trigger('mousedown', { button: 0 });
    cy.get('.angular-editor-textarea')
      .first()
      .trigger('mousemove', { x: 20, y: 20, force: true })
      .trigger('mouseup', { clientX: 20, clientY: 20, force: true })
      .click();
    cy.get('.angular-editor-textarea img')
      .first()
      .should('have.attr', 'width')
      .should('match', /^9\d{1}px$/);
  });

  it('Should maintain font size and name after operations - case 1', () => {
    cy.visit('/');
    const editor1 = cy.get('#editor1').get('.angular-editor-textarea').first();
    editor1.click();
    editor1.type('> ');
    const editor1HTMLContent = cy.get('#html-content-editor1');
    editor1HTMLContent
      .invoke('text')
      .should('contain', '<div class="angular-editor-quote">');
    cy.visit('/');
    cy.get('.fa.fa-image')
      .first()
      .should('have.prop', 'tagName')
      .should('eq', 'I');
    cy.get('.fa.fa-image')
      .first()
      .parent()
      .should('have.prop', 'tagName')
      .should('eq', 'BUTTON');
    cy.get('.fa.fa-image').first().parent().click({ force: true });
    cy.get('input[type=file]').first().invoke('css', 'display', 'block');
    cy.get('input[type=file]')
      .first()
      .selectFile([
        {
          contents:
            './projects/angular-editor-app/src/assets/angular-wysiwyg-logo2.PNG',
        },
      ]);
    cy.get('input[type=file]').first().invoke('css', 'display', 'none');
    cy.get('#html-content-editor1').should(
      'contain.text',
      '<img src="data:image/png;base64,iVBORw0KGgoAAA',
    );
    cy.get('.angular-editor-textarea img').first().should('exist');
    cy.get('.angular-editor-textarea img').first().should('have.attr', 'src');
    cy.get('.angular-editor-textarea img').first().click();
    cy.get('.angular-editor-textarea img').trigger('mousedown', { button: 0 });
    cy.get('.angular-editor-textarea')
      .first()
      .trigger('mousemove', { x: 20, y: 20, force: true })
      .trigger('mouseup', { clientX: 20, clientY: 20, force: true })
      .click();
    cy.get('.angular-editor-textarea img')
      .first()
      .should('have.attr', 'width')
      .should('match', /^9\d{1}px$/);
    const editor1Chain = cy
      .get('#editor1')
      .get('.angular-editor-textarea')
      .first();
    editor1Chain.focus();
    editor1Chain.type('{enter}Something random here.');
    editor1Chain.type('{enter}Something random here.');
    cy.get('#html-content-editor1')
      .invoke('text')
      .then((text) => text.substring(text.length - 250, text.length))
      .should(
        'include',
        '<div><font face="Comic Sans MS" size="5">Something random here.</font></div><div><font face="Comic Sans MS" size="5">Something random here.</font></div>',
      );
    const typeMultipleBackspacesStr = Array(22).fill('{backspace}').join('');
    cy.get('#editor1')
      .get('.angular-editor-textarea')
      .first()
      .type(typeMultipleBackspacesStr);
    cy.get('#html-content-editor1')
      .invoke('text')
      .then((text) => {
        return text.substring(text.length - 150, text.length);
      })
      .should(
        'include',
        '<div><font face="Comic Sans MS" size="5">Something random here.</font></div><div><br></div>',
      );
    cy.get('#editor1')
      .get('.angular-editor-textarea')
      .first()
      .type('More stuff...');
    cy.get('#html-content-editor1')
      .invoke('text')
      .then((text) => {
        return text.substring(text.length - 150, text.length);
      })
      .should(
        'include',
        '<div><font face="Comic Sans MS" size="5">Something random here.</font></div><div><font face="Comic Sans MS" size="5">More stuff...</font></div>',
      );
  });

  it('Should maintain font size and name after operations - case 2', () => {
    cy.visit('/');
    const editor1 = cy.get('#editor1').get('.angular-editor-textarea').first();
    editor1.click();
    editor1.type('> ');
    const editor1HTMLContent = cy.get('#html-content-editor1');
    editor1HTMLContent
      .invoke('text')
      .should('contain', '<div class="angular-editor-quote">');
    cy.get('.fa.fa-image')
      .first()
      .should('have.prop', 'tagName')
      .should('eq', 'I');
    cy.get('.fa.fa-image')
      .first()
      .parent()
      .should('have.prop', 'tagName')
      .should('eq', 'BUTTON');
    cy.get('.fa.fa-image').first().parent().click({ force: true });
    cy.get('input[type=file]').first().invoke('css', 'display', 'block');
    cy.get('input[type=file]')
      .first()
      .selectFile([
        {
          contents:
            './projects/angular-editor-app/src/assets/angular-wysiwyg-logo2.PNG',
        },
      ]);
    cy.get('input[type=file]').first().invoke('css', 'display', 'none');
    cy.get('#html-content-editor1').should(
      'contain.text',
      '<img src="data:image/png;base64,iVBORw0KGgoAAA',
    );
    cy.get('.angular-editor-textarea img').first().should('exist');
    cy.get('.angular-editor-textarea img').first().should('have.attr', 'src');
    cy.get('.angular-editor-textarea img').first().click();
    cy.get('.angular-editor-textarea img').trigger('mousedown', { button: 0 });
    cy.get('.angular-editor-textarea')
      .first()
      .trigger('mousemove', { x: 20, y: 20, force: true })
      .trigger('mouseup', { clientX: 20, clientY: 20, force: true })
      .click();
    cy.get('.angular-editor-textarea img')
      .first()
      .should('have.attr', 'width')
      .should('match', /^1\d{2}px$/);
    const editor1Chain = cy
      .get('#editor1')
      .get('.angular-editor-textarea')
      .first();
    editor1Chain.focus();
    editor1Chain.type('Something random here.');
    cy.get('#html-content-editor1')
      .invoke('text')
      .then((text) => text.substring(text.length - 250, text.length))
      .should(
        'include',
        '<font face="Comic Sans MS" size="5">Something random here.</font>',
      );
    const typeMultipleBackspacesStr = Array(32).fill('{backspace}').join('');
    cy.get('#editor1')
      .get('.angular-editor-textarea')
      .first()
      .type(typeMultipleBackspacesStr);
    cy.get('#html-content-editor1').invoke('text').should('eq', '');
    cy.get('#editor1').get('.angular-editor-textarea').first().type('* ');
    cy.get('#html-content-editor1')
      .first()
      .should('contain.text', '<ul><li><font face="Comic Sans MS" size="5">*');
    cy.get('#html-content-editor1')
      .first()
      .should('contain.text', '</font></li></ul>');
    cy.get('#editor1').focus().click();
    cy.get('.fa.fa-align-center').first().click();
    cy.get('#editor1').get('.angular-editor-textarea').first().click();
    cy.get('.fa.fa-list-ul')
      .first()
      .parent()
      .should('have.class', 'angular-editor-button');
    cy.get('#editor1').first().focus().click();
    cy.get('.fa.fa-list-ul').first().parent().should('have.class', 'active');
    cy.get('#editor1')
      .get('.angular-editor-textarea')
      .first()
      .type('{backspace}{backspace}');
    cy.get('.fa.fa-align-center').parent().should('not.have.class', 'active');
    cy.get('#editor1').get('.angular-editor-textarea').first().focus().click();
    cy.get('.fa.fa-align-left').parent().should('have.class', 'active');
  });

  it('should add and keep headings without overwriting font size', () => {
    cy.visit('/');
    const editor1 = cy.get('#editor1').get('.angular-editor-textarea').first();
    editor1.type('First Header h1');
    editor1.selectText(0, 0, true);
    cy.get('.ae-picker-label').first().click();
    let h1OptionChain = cy
      .get(
        '#editor1 > div > angular-editor-toolbar > div > div:nth-child(6) > ae-select > span > span > button:nth-child(1)',
      )
      .first();
    h1OptionChain.click();
    cy.get('#html-content-editor1').should(
      'have.text',
      '<h1><font face="Comic Sans MS">First Header h1</font></h1>',
    );
  });

  it('should set header correct if set before writing text', () => {
    cy.visit('/');
    cy.get('.ae-picker-label').first().click();
    let h1OptionChain = cy
      .get(
        '#editor1 > div > angular-editor-toolbar > div > div:nth-child(6) > ae-select > span > span > button:nth-child(1)',
      )
      .first();
    h1OptionChain.click();
    cy.get('#editor1')
      .get('.angular-editor-textarea')
      .first()
      .type('First Header h1');
    cy.get('#html-content-editor1').should(
      'have.text',
      '<h1><font face="Comic Sans MS">First Header h1</font></h1>',
    );
  });

  it('should set to normal paragraph when user keeps writing', () => {
    cy.visit('/');
    cy.get('#editor1')
      .get('.angular-editor-textarea')
      .first()
      .type('First Header h1')
      .selectText(0, 0, true);
    cy.get('.ae-picker-label').first().click();
    let h1OptionChain = cy
      .get(
        '#editor1 > div > angular-editor-toolbar > div > div:nth-child(6) > ae-select > span > span > button:nth-child(1)',
      )
      .first();
    h1OptionChain.click();
    cy.get('#editor1').click();
    cy.get('#editor1')
      .get('.angular-editor-textarea')
      .first()
      .type('{enter}')
      .type('Content for the h1 header...');
    cy.get('#html-content-editor1').should(
      'have.text',
      '<h1><font face="Comic Sans MS">First Header h1</font></h1><div><font face="Comic Sans MS" size="5">Content for the h1 header...</font></div>',
    );
  });

  it('should be able to add other headers and images', () => {
    cy.visit('/');
    cy.get('#editor1')
      .get('.angular-editor-textarea')
      .first()
      .type('First Header h1')
      .selectText(0, 0, true);
    cy.get('.ae-picker-label').first().click();
    cy.get(
      '#editor1 > div > angular-editor-toolbar > div > div:nth-child(6) > ae-select > span > span > button:nth-child(1)',
    )
      .first()
      .click();
    cy.get('#editor1').click();
    cy.get('#editor1')
      .get('.angular-editor-textarea')
      .first()
      .type('{enter}')
      .type('Content for the h1 header...')
      .type('{enter}');
    cy.get('.ae-picker-label').first().click();
    cy.get(
      '#editor1 > div > angular-editor-toolbar > div > div:nth-child(6) > ae-select > span > span > button:nth-child(2)',
    )
      .first()
      .click();
    cy.get('#editor1')
      .get('.angular-editor-textarea')
      .first()
      .type('Second Header h2')
      .type('{enter}Content for the Second Header which has images...');
    cy.get('#html-content-editor1').should(
      'have.text',
      '<h1><font face="Comic Sans MS">First Header h1</font></h1><div><font face="Comic Sans MS" size="5">Content for the h1 header...</font></div><h2><font face="Comic Sans MS">Second Header h2</font></h2><div><font face="Comic Sans MS" size="5">Content for the Second Header which has images...</font></div>',
    );
    cy.get('#editor1').get('.angular-editor-textarea').first().type('{enter}');
    cy.get('.fa.fa-image').first().parent().click({ force: true });
    cy.get('input[type=file]').first().invoke('css', 'display', 'block');
    cy.get('input[type=file]')
      .first()
      .selectFile([
        {
          contents:
            './projects/angular-editor-app/src/assets/angular-wysiwyg-logo2.PNG',
        },
      ]);
    cy.get('input[type=file]').first().invoke('css', 'display', 'none');
    cy.get('.angular-editor-textarea img').first().should('exist');
    cy.get('.angular-editor-textarea img').first().click();
    cy.get('.fa.fa-align-center').first().click();
    cy.get('#html-content-editor1')
      .invoke('text')
      .then((text) => text.substring(0, 345))
      .should(
        'include',
        '<h1><font face="Comic Sans MS">First Header h1</font></h1><div><font face="Comic Sans MS" size="5">Content for the h1 header...</font></div><h2><font face="Comic Sans MS">Second Header h2</font></h2><div><font face="Comic Sans MS" size="5">Content for the Second Header which has images...</font></div><div',
      );
    cy.get('#html-content-editor1')
      .invoke('text')
      .then((text) => text.substring(0, 345))
      .should('include', '<img src=');
    cy.get('#editor1')
      .get('.angular-editor-textarea')
      .first()
      .type('{enter}{enter}{backspace}');
    cy.scrollTo('top');
    cy.get('.ae-picker-label').first().click();
    cy.get(
      '#editor1 > div > angular-editor-toolbar > div > div:nth-child(6) > ae-select > span > span > button:nth-child(3)',
    )
      .first()
      .click();
    cy.get('#editor1')
      .get('.angular-editor-textarea')
      .first()
      .type('A third header. An h3 header!')
      .type('{enter}And it also has content!!!!');
    cy.get('#html-content-editor1')
      .invoke('text')
      .then((text) => text.substring(235, text.length))
      .should(
        'include',
        '<font face="Comic Sans MS">A third header. An h3 header!</font></h3><div><font face="Comic Sans MS" size="5">And it also has content!!!!</font></div>',
      );
    cy.get('#html-content-editor1')
      .invoke('text')
      .then((text) => text.substring(235, text.length))
      .should(
        'include',
        '"><font face="Comic Sans MS" size="5"><br></font></div><h3',
      );
  });

  it('Should have editor 3 present on screen with empty text', () => {
    cy.visit('/');
    const editor1 = cy.get(
      'body > app-root > div:nth-child(5) > div > div:nth-child(1) > angular-editor',
    );
    cy.get('#html-content-editor3').invoke('text').should('eq', '');
    cy.get(
      'body > app-root > div:nth-child(5) > div > div:nth-child(3) > table > tr:nth-child(19) > td:nth-child(2) > input',
    )
      .should('have.attr', 'type')
      .should('eq', 'checkbox');
    cy.get(
      'body > app-root > div:nth-child(5) > div > div:nth-child(3) > table > tr:nth-child(19) > td:nth-child(2) > input',
    )
      .should('have.attr', 'ng-reflect-model')
      .should('eq', 'true');
  });

  it('Should disable text patterns based on config', () => {
    cy.visit('/');
    const editor1 = cy.get(
      'body > app-root > div:nth-child(5) > div > div:nth-child(1) > angular-editor',
    );
    editor1.click();
    cy.get(
      'body > app-root > div:nth-child(5) > div > div:nth-child(3) > table > tr:nth-child(19) > td:nth-child(2) > input',
    )
      .should('have.attr', 'type')
      .should('eq', 'checkbox');
    cy.get(
      'body > app-root > div:nth-child(5) > div > div:nth-child(3) > table > tr:nth-child(19) > td:nth-child(2) > input',
    ).click();
    editor1.type('> ');
    cy.get('#html-content-editor3').invoke('text').should('eq', '&gt;&#160;');
  });

  it('Should be able to insert multiple images with the same name', () => {
    cy.visit('/');
    const filePathAndName = './cypress/fixtures/small-img.png';

    const addImage = () => {
      return cy.get('input[type="file"]').first().selectFile(filePathAndName);
    };

    const getEditorElement = () => {
      return cy.get('#editor1 > div > div > div > img');
    };

    cy.get('input[type=file]').first().invoke('css', 'display', 'block');

    cy.get('input[type="file"]').first().selectFile(filePathAndName);
    cy.get('#editor1 > div > div > div > img')
      .should('exist')
      .should('have.attr', 'src')
      .should('include', 'data:image/png;base64,iVBORw0KGgoAAAA');

    cy.get('input[type=file]').first().invoke('val').should('be.empty');

    for (let i = 0; i < 3; i++) {
      addImage();
      getEditorElement().should('have.length', i + 2);
      getEditorElement()
        .eq(i + 1)
        .should('have.attr', 'src')
        .should('include', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA');
      cy.get('input[type=file]').first().invoke('val').should('be.empty');
    }

    getEditorElement().should('have.length', 4);
    cy.get('input[type=file]').first().invoke('val').should('be.empty');
  });

  it('Should be able to remove and insert the same image', async () => {
    cy.visit('/');

    cy.get('input[type=file]').first().invoke('css', 'display', 'block');

    const filePathAndName = './cypress/fixtures/small-img.png';

    const addImage = () => {
      cy.get('.fa.fa-image').first().parent().click({ force: true });
      cy.get('input[type="file"]').first().selectFile(filePathAndName);
    };

    const getEditorImageElements = () => {
      return cy.get('#editor1 > div > div > div > img');
    };

    const getEditorElement = () => {
      return cy.get('#editor1 > div > div > div');
    };

    cy.get('input[type="file"]').first().selectFile(filePathAndName);
    cy.get('#editor1 > div > div > div > img')
      .should('exist')
      .should('have.attr', 'src')
      .should('include', 'data:image/png;base64,iVBORw0KGgoAAAA');

    cy.get('input[type=file]').first().should('have.value', '');

    getEditorImageElements().type('{selectall}').type('{del}');

    cy.get('input[type=file]').first().invoke('val').should('be.empty');

    addImage();

    getEditorImageElements().should('have.length', 1);
    getEditorImageElements()
      .should('have.attr', 'src')
      .should('include', 'data:image/png;base64,iVBORw0KGgoAAAA');
    cy.get('input[type=file]').first().invoke('val').should('be.empty');

    getEditorImageElements().click().type('{backspace}');

    cy.get('input[type=file]').first().invoke('val').should('be.empty');

    addImage();
    addImage();
    addImage();

    getEditorImageElements().should('have.length', 3);
    getEditorImageElements()
      .should('have.attr', 'src')
      .should('include', 'data:image/png;base64,iVBORw0KGgoAAAA');
    cy.get('input[type=file]').first().invoke('val').should('be.empty');

    getEditorElement().click();
    getEditorElement()
      .type('{backspace}')
      .type('{backspace}')
      .type('{backspace}');

    cy.get('input[type=file]').first().invoke('val').should('be.empty');
    getEditorImageElements().should('have.length', 0);

    addImage();

    getEditorImageElements().should('have.length', 1);
  });

  it('Should set font name and font size on a single letter added', () => {
    cy.visit('/');
    const editor1 = cy.get('#editor1').get('.angular-editor-textarea').first();
    editor1.click();
    editor1.type('a');
    cy.get('#html-content-editor1').should(
      'have.text',
      '<font face="Comic Sans MS" size="5">a</font>',
    );
  });

  it('Should not set font size but set font name when h1 is added', () => {
    cy.visit('/');
    cy.get('.ae-picker-label').first().click();
    let h1OptionChain = cy
      .get(
        '#editor1 > div > angular-editor-toolbar > div > div:nth-child(6) > ae-select > span > span > button:nth-child(1)',
      )
      .first();
    h1OptionChain.click();
    const editor1 = cy.get('#editor1').get('.angular-editor-textarea').first();
    editor1.click();
    editor1.type('h1');
    cy.get('#html-content-editor1').should(
      'have.text',
      '<h1><font face="Comic Sans MS">h1</font></h1>',
    );
    cy.get('#editor1').focus().click().type('{enter}');
    cy.get('#html-content-editor1').should(
      'have.text',
      '<h1><font face="Comic Sans MS">h1</font></h1><div><font face="Comic Sans MS"><br></font></div>',
    );
  });

  it('Should set both font size and name when typing after pressing enter on header', () => {
    cy.visit('/');
    cy.get('.ae-picker-label').first().click();
    let h1OptionChain = cy
      .get(
        '#editor1 > div > angular-editor-toolbar > div > div:nth-child(6) > ae-select > span > span > button:nth-child(1)',
      )
      .first();
    h1OptionChain.click();
    const editor1 = cy.get('#editor1').get('.angular-editor-textarea').first();
    editor1.click();
    editor1.type('h1');
    cy.get('#html-content-editor1').should(
      'have.text',
      '<h1><font face="Comic Sans MS">h1</font></h1>',
    );
    cy.get('#editor1').focus().click().type('{enter}abc');
    cy.get('#html-content-editor1').should(
      'have.text',
      '<h1><font face="Comic Sans MS">h1</font></h1><div><font face="Comic Sans MS" size="5">abc</font></div>',
    );
  });

  it('Should still justify content to the center', () => {
    cy.visit('/');
    cy.get('.ae-picker-label').first().click();
    let h1OptionChain = cy
      .get(
        '#editor1 > div > angular-editor-toolbar > div > div:nth-child(6) > ae-select > span > span > button:nth-child(1)',
      )
      .first();
    h1OptionChain.click();
    const editor1 = cy.get('#editor1').get('.angular-editor-textarea').first();
    editor1.click();
    editor1.type('h1');
    cy.get('#html-content-editor1').should(
      'have.text',
      '<h1><font face="Comic Sans MS">h1</font></h1>',
    );
    cy.get('#editor1').focus().click().type('{enter}abc');
    cy.get('#html-content-editor1').should(
      'have.text',
      '<h1><font face="Comic Sans MS">h1</font></h1><div><font face="Comic Sans MS" size="5">abc</font></div>',
    );
    cy.get('.fa.fa-align-center').first().click();
    cy.get('#html-content-editor1').should(
      'contain.text',
      '<h1><font face="Comic Sans MS">h1</font></h1><div',
    );
    cy.get('#html-content-editor1').should(
      'contain.text',
      '<font face="Comic Sans MS" size="5">abc</font></div>',
    );
  });

  it('Should still justify content to the right', () => {
    cy.visit('/');
    cy.get('.ae-picker-label').first().click();
    let h1OptionChain = cy
      .get(
        '#editor1 > div > angular-editor-toolbar > div > div:nth-child(6) > ae-select > span > span > button:nth-child(1)',
      )
      .first();
    h1OptionChain.click();
    const editor1 = cy.get('#editor1').get('.angular-editor-textarea').first();
    editor1.click();
    editor1.type('h1');
    cy.get('#html-content-editor1').should(
      'contain.text',
      '<h1><font face="Comic Sans MS">h1</font></h1>',
    );
    cy.get('#editor1').focus().click().type('{enter}abc');
    cy.get('#html-content-editor1').should(
      'contain.text',
      '<h1><font face="Comic Sans MS">h1</font></h1><div><font face="Comic Sans MS" size="5">abc</font></div>',
    );
    cy.get('.fa.fa-align-right').first().click();
    cy.get('#html-content-editor1').should(
      'contain.text',
      '<font face="Comic Sans MS" size="5">abc</font></div>',
    );
    cy.get('#html-content-editor1').should(
      'contain.text',
      '<h1><font face="Comic Sans MS">h1</font></h1><div',
    );
  });

  it('Should be able to justify back to the left and keep typing', () => {
    cy.visit('/');
    cy.get('.ae-picker-label').first().click();
    let h1OptionChain = cy
      .get(
        '#editor1 > div > angular-editor-toolbar > div > div:nth-child(6) > ae-select > span > span > button:nth-child(1)',
      )
      .first();
    h1OptionChain.click();
    const editor1 = cy.get('#editor1').get('.angular-editor-textarea').first();
    editor1.click();
    editor1.type('h1');
    cy.get('#html-content-editor1').should(
      'have.text',
      '<h1><font face="Comic Sans MS">h1</font></h1>',
    );
    cy.get('#editor1').focus().click().type('{enter}abc');
    cy.get('#html-content-editor1').should(
      'have.text',
      '<h1><font face="Comic Sans MS">h1</font></h1><div><font face="Comic Sans MS" size="5">abc</font></div>',
    );
    cy.get('.fa.fa-align-right').first().click();
    cy.get('#html-content-editor1').should(
      'have.text',
      '<h1><font face="Comic Sans MS">h1</font></h1><div style="text-align: right;"><font face="Comic Sans MS" size="5">abc</font></div>',
    );
    cy.get('.fa.fa-align-left').first().click();
    cy.get('#html-content-editor1').should(
      'have.text',
      '<h1><font face="Comic Sans MS">h1</font></h1><div style="text-align: left;"><font face="Comic Sans MS" size="5">abc</font></div>',
    );
    cy.get('.angular-editor-textarea').first().click('bottom').type('def');
    cy.get('#html-content-editor1').should(
      'have.text',
      '<h1><font face="Comic Sans MS">h1</font></h1><div style="text-align: left;"><font face="Comic Sans MS" size="5">abcdef</font></div>',
    );
  });

  it('Should be able to add header and text and sub headers and more text and more text and images', () => {
    cy.visit('/');
    cy.get('.ae-picker-label').first().click();
    let h1OptionChain = cy
      .get(
        '#editor1 > div > angular-editor-toolbar > div > div:nth-child(6) > ae-select > span > span > button:nth-child(1)',
      )
      .first();
    h1OptionChain.click();
    const editor1 = cy.get('#editor1').get('.angular-editor-textarea').first();
    editor1.click();
    editor1.type('h1');
    cy.get('#html-content-editor1').should(
      'have.text',
      '<h1><font face="Comic Sans MS">h1</font></h1>',
    );
    cy.get('#editor1').focus().click().type('{enter}abc');
    cy.get('#html-content-editor1').should(
      'have.text',
      '<h1><font face="Comic Sans MS">h1</font></h1><div><font face="Comic Sans MS" size="5">abc</font></div>',
    );
    cy.get('.fa.fa-align-right').first().click();
    cy.get('#html-content-editor1').should(
      'have.text',
      '<h1><font face="Comic Sans MS">h1</font></h1><div style="text-align: right;"><font face="Comic Sans MS" size="5">abc</font></div>',
    );
    cy.get('.fa.fa-align-left').first().click();
    cy.get('#html-content-editor1').should(
      'have.text',
      '<h1><font face="Comic Sans MS">h1</font></h1><div style="text-align: left;"><font face="Comic Sans MS" size="5">abc</font></div>',
    );
    cy.get('.angular-editor-textarea').first().click('bottom').type('def');
    cy.get('#html-content-editor1').should(
      'have.text',
      '<h1><font face="Comic Sans MS">h1</font></h1><div style="text-align: left;"><font face="Comic Sans MS" size="5">abcdef</font></div>',
    );
    cy.get('.fa.fa-image').first().parent().click({ force: true });
    cy.get('input[type=file]').first().invoke('css', 'display', 'block');
    cy.get('input[type=file]')
      .first()
      .selectFile([
        {
          contents:
            './projects/angular-editor-app/src/assets/angular-wysiwyg-logo2.PNG',
        },
      ]);
    cy.get('input[type=file]').first().invoke('css', 'display', 'none');
    cy.get('#html-content-editor1').should(
      'contain.text',
      '<img src="data:image/png;base64,iVBORw0KGgoAAA',
    );
    cy.get('.angular-editor-textarea img').first().should('exist');
    cy.get('.angular-editor-textarea img').first().click();
    cy.get('.fa.fa-align-center').first().click();
    cy.get('#html-content-editor1')
      .invoke('text')
      .then((text) => text.substring(0, 345))
      .should(
        'include',
        '<h1><font face="Comic Sans MS">h1</font></h1><div style="text-align: center;"><font face="Comic Sans MS" size="5">abcdef</font><img src=',
      );
  });

  it('Should write a line with each possible font style and be able to move each line seperatly left right or center', () => {
    cy.visit('/');
    const getEditor1 = () => {
      return cy.get('#editor1').get('.angular-editor-textarea').first();
    };
    cy.get('.ae-picker-label').eq(1).click();
    let fontFamilyPickChain = cy
      .get(
        '#editor1 > div > angular-editor-toolbar > div > div:nth-child(7) > ae-select > span > span > button:nth-child(1)',
      )
      .first()
      .click();
    let fonts = [];
    fontFamilyPickChain.invoke('text').then((text) => {
      fonts.push(text.trim());
      let fontFamily = fonts[0];
      const editor1 = getEditor1();
      editor1.click();
      editor1.type(`first letter type ${fontFamily}`);
      cy.get('#html-content-editor1').should(
        'have.text',
        `<font face="${fontFamily}" size="5">first letter type ${fontFamily}</font>`,
      );
      cy.get('.ae-picker-label').eq(1).click();
      fontFamilyPickChain = cy
        .get(
          '#editor1 > div > angular-editor-toolbar > div > div:nth-child(7) > ae-select > span > span > button:nth-child(2)',
        )
        .first()
        .click();
      fontFamilyPickChain.invoke('text').then((text) => {
        fonts.push(text.trim());
        fontFamily = fonts[1];
        getEditor1().type(`{enter}second letter type ${fontFamily}`);
        cy.get('#html-content-editor1').should(
          'have.text',
          `<font face="${fonts[0]}" size="5">first letter type ${fonts[0]}</font><div><font size="5" face="${fonts[1]}">second letter type ${fonts[1]}</font></div>`,
        );
        cy.get('.ae-picker-label').eq(1).click();
        fontFamilyPickChain = cy
          .get(
            '#editor1 > div > angular-editor-toolbar > div > div:nth-child(7) > ae-select > span > span > button:nth-child(3)',
          )
          .first()
          .click();
        fontFamilyPickChain.invoke('text').then((text) => {
          fonts.push(text.trim());
          fontFamily = fonts[2];
          getEditor1().type(`{enter}third letter type ${fontFamily}`);
          cy.get('#html-content-editor1').should(
            'have.text',
            `<font face="${fonts[0]}" size="5">first letter type ${fonts[0]}</font><div><font size="5" face="${fonts[1]}">second letter type ${fonts[1]}</font></div><div><font size="5" face="${fonts[2]}">third letter type ${fonts[2]}</font></div>`,
          );
          cy.get(`[face="${fonts[1]}"]`)
            .contains(`second letter type ${fonts[1]}`)
            .selectText(0, 0, true);
          cy.get('.fa.fa-align-center').first().click();

          cy.get('#html-content-editor1').should(
            'have.text',
            `<font face="${fonts[0]}" size="5">first letter type ${fonts[0]}</font><div style="text-align: center;"><font size="5" face="${fonts[1]}">second letter type ${fonts[1]}</font></div><div><font size="5" face="${fonts[2]}">third letter type ${fonts[2]}</font></div>`,
          );
          cy.get(`[face="${fonts[2]}"]`).selectText(0, 0, true);
          cy.get('.fa.fa-align-right').first().click();
          cy.get('#html-content-editor1').should(
            'have.text',
            `<font face="${fonts[0]}" size="5">first letter type ${fonts[0]}</font><div style="text-align: center;"><font size="5" face="${fonts[1]}">second letter type ${fonts[1]}</font></div><div style="text-align: right;"><font size="5" face="${fonts[2]}">third letter type ${fonts[2]}</font></div>`,
          );
          cy.get('.angular-editor-textarea')
            .first()
            .type('{selectall}{backspace}')
            .type('fourth letter type');
          cy.get('#html-content-editor1').should(
            'have.text',
            `<font face="${fonts[2]}" size="5">fourth letter type</font>`,
          );
        });
      });
    });
  });

  it('Shoul write any header with proper font name selected first', () => {
    cy.visit('/');
    // Selecting the font name:
    cy.get('.ae-picker-label').eq(1).click();
    // 5th option is Verdana
    cy.get(
      '#editor1 > div > angular-editor-toolbar > div > div:nth-child(7) > ae-select > span > span > button:nth-child(5)',
    ).click();
    // Selecting the header:
    cy.get('.ae-picker-label').first().click();
    cy.get(
      '#editor1 > div > angular-editor-toolbar > div > div:nth-child(6) > ae-select > span > span > button:nth-child(1)',
    ).click();
    cy.get('.angular-editor-textarea').first().type('WADWADWADWADWAD');
    cy.get('#html-content-editor1').should(
      'have.text',
      '<h1><font face="Verdana">WADWADWADWADWAD</font></h1>',
    );
  });

  it('Should write any header with proper font name and also font size if enter is pressed and more text is inputed', () => {
    cy.visit('/');
    // Selecting the font name:
    cy.get('.ae-picker-label').eq(1).click();
    // 5th option is Verdana
    cy.get(
      '#editor1 > div > angular-editor-toolbar > div > div:nth-child(7) > ae-select > span > span > button:nth-child(5)',
    ).click();
    // Selecting the header:
    cy.get('.ae-picker-label').first().click();
    cy.get(
      '#editor1 > div > angular-editor-toolbar > div > div:nth-child(6) > ae-select > span > span > button:nth-child(1)',
    ).click();
    cy.get('.angular-editor-textarea').first().type('WADWADWADWADWAD');
    cy.get('#html-content-editor1').should(
      'have.text',
      '<h1><font face="Verdana">WADWADWADWADWAD</font></h1>',
    );

    cy.get('.angular-editor-textarea').first().type('{enter}more text');
    cy.get('#html-content-editor1').should(
      'have.text',
      '<h1><font face="Verdana">WADWADWADWADWAD</font></h1><div><font face="Verdana" size="5">more text</font></div>',
    );

    cy.get('.angular-editor-textarea').first().type('{enter}more text');
    cy.get('#html-content-editor1').should(
      'have.text',
      '<h1><font face="Verdana">WADWADWADWADWAD</font></h1><div><font face="Verdana" size="5">more text</font></div><div><font face="Verdana" size="5">more text</font></div>',
    );

    cy.get('.angular-editor-textarea')
      .first()
      .type('{selectall}{backspace}')
      .type('more text again...');
    cy.get('#html-content-editor1').should(
      'have.text',
      '<h1><font face="Verdana">more text again...</font></h1>',
    );
    cy.get('.angular-editor-textarea')
      .first()
      .type('{selectall}{backspace}{backspace}');
    cy.get('#html-content-editor1').should('have.text', '');

    cy.get('.angular-editor-textarea')
      .first()
      .type(
        'This text should not be a header because I {enter}pressed more times the backspace key',
      );
    cy.get('#html-content-editor1').should(
      'have.text',
      '<font face="Verdana" size="5">This text should not be a header because I&nbsp;</font><div><font face="Verdana" size="5">pressed more times the backspace key</font></div>',
    );
  });

  it('Should change font name correctly when all text is selected', () => {
    cy.visit('/');
    cy.get('.ae-picker-label').eq(1).click();
    cy.get(
      '#editor1 > div > angular-editor-toolbar > div > div:nth-child(7) > ae-select > span > span > button:nth-child(5)',
    ).click();
    cy.get('.angular-editor-textarea')
      .first()
      .type(
        'Text is probably on Verdana here{enter}{enter}here too.... {backspace}',
      );
    cy.get('#html-content-editor1').should(
      'have.text',
      '<font face="Verdana" size="5">Text is probably on Verdana here</font><div><font face="Verdana" size="5"><br></font></div><div><font face="Verdana" size="5">here too....</font></div>',
    );
    cy.get('.angular-editor-textarea')
      .first()
      .type('{selectall}')
      .trigger('click')
      .trigger('dblclick');
    cy.get('#html-content-editor1').should(
      'have.text',
      '<font face="Verdana" size="5">Text is probably on Verdana here</font><div><font face="Verdana" size="5"><br></font></div><div><font face="Verdana" size="5">here too....</font></div>',
    );
    cy.get('.angular-editor-textarea').first().type('MORE TEXT');
    cy.get('#html-content-editor1').should(
      'have.text',
      '<font face="Verdana" size="5">MORE TEXT</font>',
    );
  });

  it('CASE 2- Should change font name correctly when all text is selected', () => {
    cy.visit('/');
    cy.get('.angular-editor-textarea')
      .first()
      .type('Some initial text, should be on the default font and size');
    cy.get('#html-content-editor1').should(
      'have.text',
      '<font face="Comic Sans MS" size="5">Some initial text, should be on the default font and size</font>',
    );

    // Selecting all and double clicking. Then picking same font
    cy.get('.angular-editor-textarea')
      .first()
      .type('{selectall}')
      .trigger('click')
      .trigger('dblclick');
    cy.get('.ae-picker-label').eq(1).click();
    cy.get(
      '#editor1 > div > angular-editor-toolbar > div > div:nth-child(7) > ae-select > span > span > button:nth-child(4)',
    ).click();
    cy.get('#html-content-editor1').should(
      'have.text',
      '<font face="Comic Sans MS" size="5">Some initial text, should be on the default font and size</font>',
    );

    // Then picking another font
    cy.get('.ae-picker-label').eq(1).click();
    cy.get(
      '#editor1 > div > angular-editor-toolbar > div > div:nth-child(7) > ae-select > span > span > button:nth-child(5)',
    ).click();
    cy.get('#html-content-editor1').should(
      'have.text',
      '<font size="5" face="Verdana">Some initial text, should be on the default font and size</font>',
    );

    // Then going back to the previous one
    cy.get('.ae-picker-label').eq(1).click();
    cy.get(
      '#editor1 > div > angular-editor-toolbar > div > div:nth-child(7) > ae-select > span > span > button:nth-child(4)',
    ).click();
    cy.get('#html-content-editor1').should(
      'have.text',
      '<font size="5" face="Comic Sans MS">Some initial text, should be on the default font and size</font>',
    );

    // Now pressing enter and adding a heading 2
    cy.get('.angular-editor-textarea').first().type('{enter}{backspace}');
    cy.get('.ae-picker-label').first().click();
    cy.get(
      '#editor1 > div > angular-editor-toolbar > div > div:nth-child(6) > ae-select > span > span > button:nth-child(2)',
    ).click();
    cy.get('.angular-editor-textarea').first().type('Heading 2');
    cy.get('#html-content-editor1').should(
      'have.text',
      '<h2><font face="Comic Sans MS">Heading 2</font></h2>',
    );

    cy.get('.angular-editor-textarea')
      .first()
      .type('{selectall}{enter}{backspace}{backspace}{backspace}');
    cy.get('.ae-picker-label').first().click();
    cy.get(
      '#editor1 > div > angular-editor-toolbar > div > div:nth-child(6) > ae-select > span > span > button:nth-child(2)',
    ).click();
    cy.get('.angular-editor-textarea').first().type('Heading 2');
    cy.get('#html-content-editor1').should(
      'have.text',
      '<h2><font face="Comic Sans MS">Heading 2</font></h2>',
    );
  });

  it('CASE 3 - Should change font name correctly when all text is selected', () => {
    cy.visit('/');
    cy.get('.angular-editor-textarea')
      .first()
      .type('Some initial text, should be on the default font and size');
    cy.get('#html-content-editor1').should(
      'have.text',
      '<font face="Comic Sans MS" size="5">Some initial text, should be on the default font and size</font>',
    );

    // Selecting all and double clicking. Then picking another and size font
    cy.get('.angular-editor-textarea')
      .first()
      .dblclick('center')
      .trigger('click')
      .trigger('dblclick');
    cy.get('.ae-picker-label').eq(1).click();
    cy.get(
      '#editor1 > div > angular-editor-toolbar > div > div:nth-child(7) > ae-select > span > span > button:nth-child(6)',
    ).click();
    cy.get('#html-content-editor1').should(
      'have.text',
      '<font face="Comic Sans MS" size="5">Some initial text, should be on the default font and size</font>',
    );

    cy.get('.angular-editor-textarea').first().type('more text');
    cy.get('#html-content-editor1').should(
      'have.text',
      '<font face="Comic Sans MS" size="5">Some initial text, should be on the default font and size</font><font size="5" face="Roboto">more text</font>',
    );

    // Picking font size 6
    cy.get('.ae-picker-label').eq(2).click();
    cy.get(
      '#editor1 > div > angular-editor-toolbar > div > div:nth-child(8) > ae-select > span > span > button:nth-child(6)',
    ).click();

    cy.get('.angular-editor-textarea')
      .first()
      .type('{enter}{enter}{backspace}more text');
    cy.get('#html-content-editor1').should(
      'have.text',
      '<font face="Comic Sans MS" size="5">Some initial text, should be on the default font and size</font><font size="5" face="Roboto">more text</font><div><font face="Roboto" size="6">more text</font></div>',
    );

    // Writing a bunch of text then header 1
    cy.get('.angular-editor-textarea')
      .first()
      .type(
        `Some initial text, should be on the default font and size {enter}
        more text {enter}
        more text {enter}
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ac nisl nec nunc ultricies ultricies.
        {enter}`.replace(/  +/g, ''),
      );
    cy.get('.ae-picker-label').first().click();
    cy.get(
      '#editor1 > div > angular-editor-toolbar > div > div:nth-child(6) > ae-select > span > span > button:nth-child(1)',
    ).click();
    cy.get('.angular-editor-textarea').first().type('Header 1');

    // Write a text thinking its header but its actually not
    cy.get('.angular-editor-textarea')
      .first()
      .type('{enter}{backspace}{backspace}{backspace} more text to the header');
    cy.get('#html-content-editor1').should(
      'contain.text',
      `<font face="Comic Sans MS" size="5">Some initial text, should be on the default font and size</font><font size="5" face="Roboto">more text</font><div><font face="Roboto" size="6">more textSome initial text, should be on the default font and size`,
    );
    cy.get('#html-content-editor1').should(
      'contain.text',
      `</font></div><div><font face="Roboto" size="6"><br></font></div><div><font face="Roboto" size="6">more text`,
    );
    cy.get('#html-content-editor1').should(
      'contain.text',
      `</font></div><div><font face="Roboto" size="6"><br></font></div><div><font face="Roboto" size="6">more text`,
    );
    cy.get('#html-content-editor1').should(
      'contain.text',
      `</font></div><div><font face="Roboto" size="6"><br></font></div><div><font face="Roboto" size="6">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ac nisl nec nunc ultricies ultricies.</font></div><div><font face="Roboto" size="6"><br></font></div><h1><font face="Roboto">Header more text to the header</font></h1>`,
    );

    // Type enter once write some text with a quote and then more text then enter again then add another header
    cy.get('.angular-editor-textarea')
      .first()
      .type('{enter}A quote: "This is a quote" then more text{enter}');
    cy.get('.ae-picker-label').first().click();
    cy.get(
      '#editor1 > div > angular-editor-toolbar > div > div:nth-child(6) > ae-select > span > span > button:nth-child(2)',
    ).click();
    cy.get('.angular-editor-textarea').first().type('Header 2');
    cy.get('#html-content-editor1').should(
      'contain.text',
      `A quote: "This is a quote" then more text</font></div><h2><font face="Roboto">Header 2</font></h2>`,
    );
  });

  it('Should be able to toggle bold on ctrl+b and also keep the fonts and headings', () => {
    cy.visit('/');
    cy.get('.angular-editor-textarea')
      .first()
      .type(
        'Some initial text, should be on the default font and size {enter}more text {enter}more text {enter}Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ac nisl nec nunc ultricies ultricies.{enter}',
      );
    cy.get('.ae-picker-label').first().click();
    cy.get(
      '#editor1 > div > angular-editor-toolbar > div > div:nth-child(6) > ae-select > span > span > button:nth-child(1)',
    ).click();
    cy.get('.angular-editor-textarea').first().type('Header 1');
    cy.get('.angular-editor-textarea')
      .first()
      .type('{enter}{backspace}{backspace}{backspace} more text to the header');
    cy.get('#html-content-editor1').should(
      'have.text',
      '<font face="Comic Sans MS" size="5">Some initial text, should be on the default font and size&nbsp;</font><div><font face="Comic Sans MS" size="5">more text&nbsp;</font></div><div><font face="Comic Sans MS" size="5">more text&nbsp;</font></div><div><font face="Comic Sans MS" size="5">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ac nisl nec nunc ultricies ultricies.</font></div><h1><font face="Comic Sans MS">Header more text to the header</font></h1>',
    );

    cy.get('.angular-editor-textarea')
      .first()
      .type('{enter}A quote: "This is a quote" then more text{enter}');
    cy.get('.ae-picker-label').first().click();
    cy.get(
      '#editor1 > div > angular-editor-toolbar > div > div:nth-child(6) > ae-select > span > span > button:nth-child(2)',
    ).click();
    cy.get('.angular-editor-textarea').first().type('Header 2');

    cy.get('.angular-editor-textarea')
      .first()
      .type('{selectall}')
      .trigger('click')
      .trigger('dblclick');
    cy.get('.fa.fa-bold').first().click();
    cy.get('#html-content-editor1').should(
      'have.text',
      '<font face="Comic Sans MS" size="5"><b>Some initial text, should be on the default font and size&nbsp;</b></font><div><font face="Comic Sans MS" size="5"><b>more text&nbsp;</b></font></div><div><font face="Comic Sans MS" size="5"><b>more text&nbsp;</b></font></div><div><font face="Comic Sans MS" size="5"><b>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ac nisl nec nunc ultricies ultricies.</b></font></div><h1><font face="Comic Sans MS">Header more text to the header</font></h1><div><font face="Comic Sans MS" size="5"><b>A quote: "This is a quote" then more text</b></font></div><h2><font face="Comic Sans MS">Header 2</font></h2>',
    );
  });

  it('Should be able to click outside and click inside the text and write with the correct font name and size', () => {
    cy.visit('/');
    cy.get('#editor1 > div > div > div').first().click('center');
    cy.get('#editor1 > div > div > div').first().should('be.focused');
    cy.get('body').click('top');
    cy.get('#editor1 > div > div > div').first().should('not.be.focused');
    cy.get('#editor1 > div > div > div').first().click('center');
    cy.get('#editor1 > div > div > div').first().should('be.focused');
    cy.get('#editor1 > div > div > div').first().type('A b c');
    cy.get('#html-content-editor1')
      .first()
      .should('have.text', '<font face="Comic Sans MS" size="5">A b c</font>');
    cy.get('.angular-editor-textarea').first().type('{selectall}');
  });

  it('Should be able to click outside and set initial text as header', () => {
    cy.visit('/');
    cy.get('#editor1 > div > div > div').first().click('center');
    cy.get('#editor1 > div > div > div').first().should('be.focused');
    cy.get('body').click('top');
    cy.get('#editor1 > div > div > div').first().should('not.be.focused');
    cy.get('.ae-picker-label').first().click();
    cy.get(
      '#editor1 > div > angular-editor-toolbar > div > div:nth-child(6) > ae-select > span > span > button:nth-child(1)',
    ).click();
    cy.get('#editor1 > div > div > div').first().click('center');
    cy.get('#editor1 > div > div > div').first().should('be.focused');
    cy.get('#editor1 > div > div > div').first().type('A b c');
    cy.get('#html-content-editor1')
      .first()
      .should('have.text', '<h1><font face="Comic Sans MS">A b c</font></h1>');
    cy.get('.angular-editor-textarea').first().type('{selectall}');
  });

  it('Should be able to click outside and change font name and size from the default', () => {
    cy.visit('/');
    cy.get('#editor1 > div > div > div').first().click('center');
    cy.get('#editor1 > div > div > div').first().should('be.focused');
    cy.get('body').click('top');
    cy.get('#editor1 > div > div > div').first().should('not.be.focused');
    cy.get('.ae-picker-label').eq(1).click();
    cy.get(
      '#editor1 > div > angular-editor-toolbar > div > div:nth-child(7) > ae-select > span > span > button:nth-child(6)',
    ).click();
    cy.get('#editor1 > div > div > div').first().click('center');
    cy.get('#editor1 > div > div > div').first().should('be.focused');
    cy.get('#editor1 > div > div > div').first().type('A b c');
    cy.get('#html-content-editor1')
      .first()
      .should('have.text', '<font face="Roboto" size="5">A b c</font>');
    cy.get('.angular-editor-textarea').first().type('{selectall}');
  });
});
