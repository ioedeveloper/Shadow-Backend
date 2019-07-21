// importing libraries and dependencies
import { Request, Response } from 'express';
import express = require('express');
import {createConnection} from 'typeorm';
import bodyParser = require('body-parser');
import * as UserEndpoint from './api/user';
import * as  dotenv from 'dotenv';
dotenv.config();

// establish database connection.
(async () => {
    try {
        if (process.env.NODE_ENV === 'development') {
            await createConnection();
        } else {
            await createConnection({
                type: 'mongodb',
                useNewUrlParser: true,
                // tslint:disable-next-line:max-line-length
                url: `mongodb+srv://${process.env.MONGODB_ATLAS_USERNAME}:${process.env.MONGODB_ATLAS_PASSWORD}@cluster0-uxdic.mongodb.net/test?retryWrites=true&w=majority`,
                ssl: true,
                entities: ['./src/model/*'],
            });
        }
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
        console.error(`Error: ${error}`);
    }
})();
