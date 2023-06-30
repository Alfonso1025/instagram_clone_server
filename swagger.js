const swaggerUi = require('swagger-ui-express')
const swaggerJsdoc = require('swagger-jsdoc')

const options = {

    definition: {

      openapi: '3.0.0',
      info: {
        title: 'Instagram_clone_api',
        description: 'Documentation for the endpoints of the Instagram_clone_api ',
        version: '1.0.0',
      },
    },
    apis: ['./routes/*.js', './controllers/*.js', 'authentication.js', 'dashboard.js', 'userPost.js','userSearch.js','chat.js'],
  }
  
const swaggerSpec = swaggerJsdoc(options)

function swaggerDocs(app) {
  // Swagger Page
  app.use('/documentation', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

}

module.exports = swaggerDocs