require("dotenv").config();
const express = require("express");
const app = express();
const dbConnection = require("./db");

app.use(require("./middleware/headers"))
const controllers = require("./controllers");
app.use(express.json());

app.use("/user", controllers.userController);

app.use("/channel", controllers.channelController);
// app.use("/channelentry", controllers.channelEntryController);

app.use(require("./middleware/validate-jwt"));
// dbConnection.authenticate()
//     .then(() => dbConnection.sync())
//     .then(() => {
//         app.listen(3000, () => {
//             console.log(`[Server]: App is listening on 3000`)
//         })
//     })
//     .catch((err) => {
//         console.log(`[Server]: Server has crashed. Error = ${err}`)
//     });
try {
    dbConnection
        .authenticate()
        .then(async () => await dbConnection.sync()) // force: true will drop all tables in pgAdmin and resync them. This is necessary after you make a change to a model, and need to sync any new table headers to the database.
        .then(() => {
            app.listen(process.env.PORT, () => {
                console.log(`[SERVER]: App is listening on ${process.env.PORT}`);
            });
        });
} catch (err) {
    console.log('[SERVER]: Server crashed');
    console.log(err);
}

