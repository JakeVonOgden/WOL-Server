require('dotenv').config();
const Express = require('express');
const app = Express();
const controllers = require('./controllers')
const dbConnection = require('./db');


app.use(Express.json());
app.use('/user', controllers.userController)
//app.use(require('./middleware/validate-jwt'));
app.use('/log', controllers.logController)




dbConnection.authenticate()
    .then(() => dbConnection.sync())
    .then(() => {
        app.listen(5000, () => {
            console.log(`[Server]: App is listening on 5000.`);
        });
    })
    .catch((err) => {
        console.log(`[Server]: Server crashed. Error = ${err}`);
    });