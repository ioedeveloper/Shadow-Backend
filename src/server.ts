// importing libraries and dependencies
import { Request, Response } from 'express';
import express = require('express');
import {createConnection} from 'typeorm';

// establish database connection.
createConnection().then(() => {
    // tslint:disable-next-line:no-console
    console.log('Database Connection Established...');

    // create a new express application instance
    const app: express.Application = express();

        // the port the express app will listen on
    const port: any = process.env.PORT || 2002;

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

// tslint:disable-next-line:no-console
}).catch((error) => console.log(`Error: ${error}`));
