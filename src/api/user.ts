import * as express from 'express';
import { Request, Response } from 'express';
const router = express.Router();

router.post('/signup', async function(req: Request, res: Response) {
    const data = req.body;
    if (!data.email) {
        return res.status(400).send({ message: 'User Email is Required!' });
    }
    if (!data.extensionId) {
        return res.status(400).send({ message: 'VSCode Extension Id is Required!'});
    }

});
