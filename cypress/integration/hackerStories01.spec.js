describe('Hacker Stories', () => {
  beforeEach(() => {
    cy.intercept({
      method: 'GET',
      pathname: '**/search',
      query: {
        query: 'React',
        page: '0'
      }
    }).as('getStories')

    // cy.intercept('GET', '**/search?query=React&page=0').as('waitElement')
    cy.visit('/')

    cy.wait('@getStories')
  })


  context('List of stories', () => {

    it('shows 20 stories, then the next 20 after clicking "More"', () => {

      cy.intercept({
        method: 'GET',
        pathname: '**/search',
        query: {
          query: 'React',
          page: '1'
        }
      }).as('getNextStories')

      cy.get('.item').should('have.length', 20)

      cy.contains('More').click()
      cy.wait('@getNextStories')

      cy.get('.item').should('have.length', 40)
    })

    context('Search', () => {
      const initialTerm = 'React'
      const newTerm = 'Cypress'

      beforeEach(() => {
        cy.intercept({
          method: 'GET',
          pathname: '**/search',
          query: {
            query: `${newTerm}`

          }
        }).as('getNewTermtStories')

        cy.get('#search')
          .clear()
      })

      it('searches via the last searched term', () => {
        cy.get('#search')
          .type(`${newTerm}{enter}`)

        cy.wait('@getNewTermtStories')

        cy.get(`button:contains(${initialTerm})`)
          .should('be.visible')
          .click()

        cy.wait('@getStories')

        cy.get('.item').should('have.length', 20)
        cy.get('.item')
          .first()
          .should('contain', initialTerm)
        cy.get(`button:contains(${newTerm})`)
          .should('be.visible')
      })
    })
  })


})
