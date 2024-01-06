describe('My First Test', () => {
  it('Visits the initial project page', () => {
    cy.visit('/')
    cy.contains('Basic Example with HTML Output')
  })

  it('Checks for text pattern and insert quote - case 1', () => {
    cy.visit('/')
    const editor1 = cy.get('#editor1')
    editor1.click()
    editor1.type('> ')
    const editor1HTMLContent = cy.get('#html-content-editor1')
    editor1HTMLContent.invoke('text').should('contain', '<div class="quote">')
  })

  it('Checks for text pattern and insert quote', () => {
    cy.visit('/')
    const editor1 = cy.get('#editor1')
    editor1.click()
    editor1.type('> Hello World')
    const editor1HTMLContent = cy.get('#html-content-editor1')
    editor1HTMLContent.should('have.text', '<div class="quote">&nbsp;Hello World</div>')
  })

  it('Should revert back to character on undo button press', () => {
    cy.visit('/')
    const editor1 = cy.get('#editor1')
    editor1.click()
    editor1.type('> ')
    const undoBtn = cy.get('.fa.fa-undo').first()
    undoBtn.click()
    const editor1HTMLContent = cy.get('#html-content-editor1')
    editor1HTMLContent.should('not.have.text', '<div class="quote">')
    editor1HTMLContent.invoke('text').should('contain', '&gt;')
  })

  it('Should revert back to character on undo command called', () => {
    cy.visit('/')
    const editor1 = cy.get('#editor1').get('.angular-editor-textarea').first()
    editor1.click()
    editor1.type('> ')
    const editor1HTMLContent = cy.get('#html-content-editor1')
    editor1HTMLContent.invoke('text').should('contain', '<div class="quote">')
    cy.document().invoke('execCommand', 'undo', false)
    cy.get('#html-content-editor1').invoke('text').should('contain', '&gt;')
    cy.document().invoke('execCommand', 'redo', false)
    cy.get('#html-content-editor1').invoke('text').should('contain', '<div class="quote">')
    editor1.type('{enter}{enter}')
    cy.get('#html-content-editor1').then(t => expect(new RegExp('<br><br>$').test(t.text())).equals(true))
  })
})
