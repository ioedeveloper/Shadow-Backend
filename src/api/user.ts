import * as express from 'express';
import { Request, Response } from 'express';
import { UserService } from '../service/userService';

const router = express.Router();
const userService = new UserService();

router.post('/signup', async function(req: Request, res: Response) {
    const data = req.body;
    if (!data.email) {
        return res.status(400).send({ message: 'User Email is Required!' });
    }
    if (!data.extensionId) {
        return res.status(400).send({ message: 'VSCode Extension Id is Required!'});
    }

    try {
        const newUser = await userService.addUser(data);
        return res.status(200).send({ data: newUser });
    } catch (error) {
        throw error;
    }

});
