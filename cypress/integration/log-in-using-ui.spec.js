/// <reference types="cypress" />

describe('logs in', () => {
  it('using UI', () => {
    cy.visit('/')
    cy.location('pathname').should('equal', '/login')

    // enter valid username and password
    cy.get('[data-cy=login-button]').click()
    cy.get('[data-testid=login-username]').type(Cypress.env('username'))
    cy.get('[data-testid=login-password]').type(Cypress.env('password'))
    cy.get('[data-testid=login-button]').click()

    // confirm we have logged in successfully
    cy.location('pathname').should('equal', '/')
    cy.contains('Hi Test!')
      .should('be.visible')
      .then(() => {
        /* global window */
        const userString = window.localStorage.getItem('user')

        expect(userString).to.be.a('string')
        const user = JSON.parse(userString)

        expect(user).to.be.an('object')
        expect(user).to.have.keys(['id', 'username', 'firstName', 'lastName', 'token'])

        expect(user.token).to.be.a('string')
      })

    // now we can log out
    cy.get('[data-testid=logout-button]').click()
    cy.location('pathname').should('equal', '/login')
  })

  //   it('Fails to access protected page', () => {
  //     cy.visit('/tracks')
  //     cy.location('pathname').should('equal', '/login')
  //   })

  //   it('Does not log in with invalid password', () => {
  //     cy.visit('/')
  //     cy.location('pathname').should('equal', '/login')

  //     // try logging in with invalid password
  //     cy.get('[data-cy=login-button]').click()
  //     cy.get('[data-testid=login-username]').type('username')
  //     cy.get('[data-testid=login-password]').type('wrong-password')
  //     cy.get('[data-testid=login-button]').click()

  //     cy.contains('Oops! Something went wrong, please try again or check out our help area').should(
  //       'be.visible'
  //     )
  //   })
})
