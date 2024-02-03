describe('My First Test', () => {
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
    const quoteChain = cy.get('.angular-editor-quote');
    const selectedTextChain = quoteChain.selectText(0, 12);
    selectedTextChain.should('have.string', 'Hello World');
    cy.window()
      .then((win) => win.getSelection().toString().trim())
      .should('equal', 'Hello World');
    const italicBtnChain = cy.get('.fa.fa-italic').first();
    italicBtnChain.click();
    const editor1HTMLContentChain = cy.get('#html-content-editor1');
    editor1HTMLContentChain.should('contain.text', '<i>&nbsp;Hello World</i>');
  });

  it('Should undo italic command on highlighted text', () => {
    cy.visit('/');
    const editor1Chain = cy.get('#editor1');
    editor1Chain.click();
    editor1Chain.type('> Hello World');
    editor1Chain.scrollIntoView();
    let quoteChain = cy.get('.angular-editor-quote');
    let selectedTextChain = quoteChain.selectText(0, 12);
    selectedTextChain.should('have.string', 'Hello World');
    cy.window()
      .then((win) => win.getSelection().toString().trim())
      .should('equal', 'Hello World');
    let italicBtnChain = cy.get('.fa.fa-italic').first();
    italicBtnChain.click();
    let editor1HTMLContentChain = cy.get('#html-content-editor1');
    editor1HTMLContentChain.should('contain.text', '<i>&nbsp;Hello World</i>');
    quoteChain = cy.get('.angular-editor-quote>i');
    selectedTextChain = quoteChain.selectText(3, 11);
    selectedTextChain.should('eq', 'llo Worl');
    italicBtnChain = cy.get('.fa.fa-italic').first();
    italicBtnChain.click();
    editor1HTMLContentChain = cy.get('#html-content-editor1');
    editor1HTMLContentChain.should(
      'contain.text',
      '<i>&nbsp;He</i>llo Worl<i>d</i>',
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
      '<div class="angular-editor-quote">&nbsp;Hello World</div>',
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
});
