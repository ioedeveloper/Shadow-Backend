// importing libraries and dependencies
import { Request, Response } from 'express';
import express = require('express');
import {createConnection} from 'typeorm';
import bodyParser = require('body-parser');
import * as UserEndpoint from './api/user';

// establish database connection.
(async () => {
    try {
        const connection = await createConnection();
        // tslint:disable-next-line:no-console
        console.log('Database Connection Established...');

        // create a new express application instance
        const app: express.Application = express();

        // the port the express app will listen on
        const port: any = process.env.PORT || 2002;

        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: false }));

        app.use('/user', UserEndpoint.router);

        app.get('/', (req: Request, res: Response) => {
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify({
                status: 200,
                message: 'Service is up!',
            }));
        });

        // serve the application at the given port
        app.listen(port, () => {
            // tslint:disable-next-line:no-console
            console.log(`Listening at http://localhost:${port}/`);
        });
    } catch (error) {
        // tslint:disable-next-line:no-console
        console.log(`Error: ${error}`);
    }
})();
