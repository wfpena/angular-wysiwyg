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
      '&nbsp;<font face="Comic Sans MS" size="5"><i>Hello World</i>',
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
      '&nbsp;<font face="Comic Sans MS" size="5"><i>Hello World</i>',
    );
    cy.get('.ae-picker-label').eq(1).click();
    cy.get(
      '#editor1 > div > angular-editor-toolbar > div > div:nth-child(7) > ae-select > span > span > button:nth-child(2)',
    )
      .first()
      .click();
    cy.get('#html-content-editor1').should(
      'contain.text',
      '&nbsp;<font size="5" face="Times New Roman"><i style="">Hello World</i></font></div>',
    );
    cy.window().then((win) => win.getSelection().removeAllRanges());
    cy.get('#editor1').focus().click().type('{enter}{enter}');
    cy.get('#html-content-editor1').should(
      'contain.text',
      '<font size="5" face="Times New Roman"><i style="">Hello World</i></font></div><font size="5" face="Times New Roman"><i style=""><br></i></font><font size="5" face="Times New Roman"><i style=""><br></i></font>',
    );
    cy.get('.angular-editor-wrapper').first().selectText(0, 0, true);
    cy.get('.ae-picker-label').eq(1).click();
    cy.get(
      '#editor1 > div > angular-editor-toolbar > div > div:nth-child(7) > ae-select > span > span > button:nth-child(1)',
    )
      .first()
      .click();
    cy.get('#html-content-editor1').should(
      'contain.text',
      '<i style="">Hello World</i></font></div><font size="5" face="Arial"><i style=""><br></i></font><font size="5" face="Times New Roman"><i style=""><br></i></font>',
    );
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
      '&nbsp;<font face="Comic Sans MS" size="5"><i>He</i>llo Worl<i>d</i>',
    );
  });

  it('Checks for text pattern and insert quote', () => {
    cy.visit('/');
    const editor1 = cy.get('#editor1');
    editor1.click();
    editor1.type('> Hello World');
    const editor1HTMLContent = cy.get('#html-content-editor1');
    editor1HTMLContent.should(
      'have.text',
      '<div class="angular-editor-quote">&nbsp;<font face="Comic Sans MS" size="5">Hello World</font></div>',
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
      .invoke('text')
      .then((text) => {
        return text.substring(text.length - 250, text.length);
      })
      .should(
        'eq',
        '<ul><li><font face="Comic Sans MS" size="5">*&nbsp;</font></li></ul>',
      );
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
        '<h1><font face="Comic Sans MS">First Header h1</font></h1><div><font face="Comic Sans MS" size="5">Content for the h1 header...</font></div><h2><font face="Comic Sans MS">Second Header h2</font></h2><div><font face="Comic Sans MS" size="5">Content for the Second Header which has images...</font></div><div style="text-align: center;"><img src=',
      );
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
        '"><font face="Comic Sans MS" size="5"><br></font></div><h3 style="text-align: left;"><font face="Comic Sans MS">A third header. An h3 header!</font></h3><div><font face="Comic Sans MS" size="5">And it also has content!!!!</font></div>',
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
});
