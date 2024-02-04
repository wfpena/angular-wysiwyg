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
    cy.get('.ae-picker-label').eq(1).click();
    cy.get(
      '#editor1 > div > angular-editor-toolbar > div > div:nth-child(7) > ae-select > span > span > button:nth-child(2)',
    ).click();
    cy.get('#html-content-editor1').should(
      'contain.text',
      '&nbsp;<font size="5" face="Times New Roman"><i style="">Hello World</i></font></div>',
    );
    cy.window().then((win) => win.getSelection().removeAllRanges());
    cy.get('#editor1').type('{enter}{enter}');
    cy.get('#html-content-editor1').should(
      'contain.text',
      '<font size="5" face="Times New Roman"><i style="">Hello World</i></font></div><font size="5" face="Times New Roman"><i style=""><br></i></font><font size="5" face="Times New Roman"><i style=""><br></i></font>',
    );
    cy.get('.angular-editor-wrapper').first().selectText(0, 0, true);
    cy.get('.ae-picker-label').eq(1).click();
    cy.get(
      '#editor1 > div > angular-editor-toolbar > div > div:nth-child(7) > ae-select > span > span > button:nth-child(1)',
    ).click();
    cy.get('#html-content-editor1').should(
      'contain.text',
      '<i style="">Hello World</i></font></font></div><font size="5" face="Arial"><i style=""><br></i></font><font size="5" face="Times New Roman"><i style=""><br></i></font>',
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
      expect(t.text()).to.match(/<p><br><\/p>$/),
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
      .should('equal', '96px');
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
      .should('equal', '96px');
    const editor1Chain = cy
      .get('#editor1')
      .get('.angular-editor-textarea')
      .first();
    editor1Chain.focus();
    editor1Chain.type('{enter}Something random here.');
    editor1Chain.type('{enter}Something random here.');
    cy.get('#html-content-editor1').should(
      'contain.text',
      '<p><font face="Comic Sans MS" size="5">Something random here.</font></p><p><font face="Comic Sans MS" size="5">Something random here.</font></p>',
    );
    const typeMultipleBackspacesStr = Array(22).fill('{backspace}').join('');
    cy.get('#editor1')
      .get('.angular-editor-textarea')
      .first()
      .type(typeMultipleBackspacesStr);
    cy.get('#html-content-editor1').should(
      'contain.text',
      '<p><font face="Comic Sans MS" size="5">Something random here.</font></p><p><br></p>',
    );
    cy.get('#editor1')
      .get('.angular-editor-textarea')
      .first()
      .type('More stuff...');
    cy.get('#html-content-editor1').should(
      'contain.text',
      '<p><font face="Comic Sans MS" size="5">Something random here.</font></p><p><font face="Comic Sans MS" size="5">More stuff...</font></p>',
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
      .should('equal', '96px');
    const editor1Chain = cy
      .get('#editor1')
      .get('.angular-editor-textarea')
      .first();
    editor1Chain.focus();
    editor1Chain.type('Something random here.');
    cy.get('#html-content-editor1').should(
      'contain.text',
      '<font face="Comic Sans MS" size="5">Something random here.</font>',
    );
    const typeMultipleBackspacesStr = Array(32).fill('{backspace}').join('');
    cy.get('#editor1')
      .get('.angular-editor-textarea')
      .first()
      .type(typeMultipleBackspacesStr);
    cy.get('#html-content-editor1').invoke('text').should('eq', '');
    cy.get('#editor1').get('.angular-editor-textarea').first().type('* ');
    cy.get('#html-content-editor1').should(
      'have.text',
      '<ul><li><font face="Comic Sans MS" size="5"></font></li></ul>',
    );
    cy.get('.fa.fa-align-center').first().click();
    cy.get('#editor1').click();
    cy.get('.fa.fa-list-ul').first().parent().should('have.class', 'active');
    cy.get('#editor1')
      .get('.angular-editor-textarea')
      .first()
      .type('{backspace}{backspace}');
    cy.get('.fa.fa-align-center').parent().should('not.have.class', 'active');
    cy.get('.fa.fa-align-left').parent().should('have.class', 'active');
  });
});
