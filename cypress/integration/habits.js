
function registro (){
  cy.log("email "+ Cypress.env('email'));
  cy.visit('https://habitica.com/static/home')
  //cy.contains('Ingresar').click()
  cy.get('.form').find('input[id="usernameInput"]').click().type(Cypress.env('username'))
  cy.get('.form').find('input[type="email"]').click().type(Cypress.env('email'))
  cy.get('.form').find('input[placeholder="Contraseña"]').click().type(Cypress.env('password'))
  cy.get('.form').find('input[placeholder="Confirma contraseña"]').click().type(Cypress.env('password'))
  cy.get('.sign-up').click()
  expect(cy.get('div[id="avatar-modal___BV_modal_body_"]').should('exist'))
}

function validacion (){
      cy.log("email "+ Cypress.env('email'));
      cy.visit('https://habitica.com/static/home')
      //cy.contains('Ingresar').click()
      cy.get('a[href="/login"]').click()
      cy.get('#login-form').find('input[id="usernameInput"]').click().type(Cypress.env('email'))
      cy.get('#login-form').find('input[id="passwordInput"]').click().type(Cypress.env('password'))
      cy.get('.btn-info').click()
      if(cy.get('textarea[placeholder="Add a Habit"]').should('exist')){
        cy.get('textarea[placeholder="Add a Habit"]').click().clear().type("Habito de pruebas{enter}")
        //cy.get('h3').find('p').getText()
        var tarea= cy.get('h3').find('p').contains("Habito de pruebas")
        tarea.invoke('text').then((text)=>{
            expect(text).equal('Habito de pruebas')
        })
      }
    }


describe('Habitica testing', function() {
  before(function() {
    Cypress.env('username');
    Cypress.env('email');
    Cypress.env('password')
    cy.log('created new user')
    cy.readFile('/Users/adrianabonilla/Documents/andes/pruebas/project/workerWebCypress/app/data.json').then((data) => {
        cy.log("--- "+data["email"]);
        Cypress.env('email',data["email"]);
        Cypress.env('username',data["username"]);
        Cypress.env('password',data["password"]);
        
    })
  })

    it('register habitica random data',function(){
      registro();
    })

    // it('Visits habitica and add a Habit', function() {
    //   validacion();
      
    // })

    // it('Visits habitica and edit a habit', function() {
    //   cy.log("pass "+ Cypress.env('password'));
    //   cy.visit('https://habitica.com/static/home')
    //   //cy.contains('Ingresar').click()
    //   cy.get('a[href="/login"]').click()
    //   cy.get('#login-form').find('input[id="usernameInput"]').click().type(Cypress.env('email'))
    //   cy.get('#login-form').find('input[id="passwordInput"]').click().type(Cypress.env('password'))
    //   cy.get('.btn-info').click()
    //   if(cy.get('h3').find('p').contains("Habito de pruebas").should('exist')){
    //     var tarea= cy.get('div').find('p').contains("Habito de pruebas")
    //     tarea.click()
    //     var mod=cy.get('input[class="form-control title-input"]')
    //     mod.click().clear({force:true}).type("Habito modificado{enter}")
    //     cy.get('#task-modal .task-modal-footer').find('button[class="btn btn-primary"]').click()
    //   }
    // })
    // it('Visits habitica and delete a habit', function() {
    //   cy.visit('https://habitica.com/static/home')
    //   cy.get('a[href="/login"]').click()
    //   cy.get('#login-form').find('input[id="usernameInput"]').click().type(Cypress.env('email'))
    //   cy.get('#login-form').find('input[id="passwordInput"]').click().type(Cypress.env('password'))
    //   cy.get('.btn-info').click()
    //   if(cy.get('h3').find('p').contains("Habito de pruebas").should('exist')){
    //     var tarea= cy.get('div').find('p').contains("Habito de pruebas")
    //     tarea.click()
    //     cy.get('div').find('span').contains('Delete this Task').click()
    //     expect(cy.get('h3').find('p').contains("Habito de pruebas").should('not.exist'))
    //   }
    // })
})
