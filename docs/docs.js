
const swaggerJsDocs = require('swagger-jsdoc')

const swaggerOptions = {
    swagger : '2.0',
    swaggerDefinition : {
        
        info : { 

                tittle : 'instagram clone server API',

                description : 'instagram clone API documentation',
            
                contact : {
                            name : 'Alfonso Ramirez',
                          }
                },
        servers : ['http://localhost:5001']
},
        tags : [
            {
                name : 'authentication',
                description : 'authentication routes'
            }
        ],
        paths : {

                '/authentication/registerUser' : {
                    post : {
                        tags : ['authentication'],

                        description : 'insert user info into database',

                        parameters : {

                            content : {

                                "application-json" : {

                                    schema : {

                                        type : "Object",

                                        properties : {

                                            userName : {
                                                type : "string",
                                                example : "mariano"
                                                
                                            },
                                            email : {
                                                type : "string",
                                                example : "mariano@gmail.com"
                                                
                                            },
                                            password : {
                                                type : "string",
                                                example : "446hdhd"
                                                
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        responses : {
                            200 : {
                                description : 'Password ecrypted, user inserted in the db.',
                                content : {
                                    "aplication/json" : {
                                        schema : {
                                            type : "Object",
                                            example : {
                                                "message": " new user inserted",
                                                "data": {
                                                            "acknowledged": true,
                                                             "insertedId": "62d57b6a3f668e6b15eedd34"
                                                        },
                                                "code": 200
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                },
     apis : ['server.js', './routes/*.js']
} 

swaggerDocs = swaggerJsDocs(swaggerOptions)
module.exports = swaggerDocs



