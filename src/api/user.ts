import * as express from 'express';
import { Request, Response } from 'express';
import { UserService } from '../service/userService';
import * as jwt from 'jsonwebtoken';
import * as  dotenv from 'dotenv';
import * as path from 'path';
dotenv.config();

const router = express.Router();
const userService = new UserService();

/**
 * EndPoint: /user/signup
 * @param Request
 * @param Response
 * @description Signup endpoint for new users.
 */
router.post('/signup', async function(req: Request, res: Response) {
    const data = req.body;

    try {
        const newUser = await userService.addUser(data);
        const response = {
            id: newUser._id,
            extensionId: newUser.extensionId,
        };
        return res.status(200).send(response);
    } catch (error) {
        if (error.message) {
            return res.status(400).send({
                message: error.message,
            });
        } else {
            return res.status(500).send(error);
        }
    }

});

/**
 * EndPoint: /user/signin
 * @param Request
 * @param Response
 * @description Login endpoint for existing users.
 */
router.post('/signin', async function(req: Request, res: Response) {
    const data = req.body;
    const numberOfAttempts = req.query.attempts;

    if (!data.extensionId) {
        return res.status(400).send({
            message: 'ExtensionID is required.',
        });
    }
    try {
        const user = await userService.login(data, numberOfAttempts);
        const response = {
            id: user._id,
            extensionId: user.extensionId,
            email: user.email,
            accessCode: user.accessCode,
        };
        return res.status(200).send(response);
    } catch (error) {
        if (error.message) {
            return res.status(400).send({
                message: error.message,
            });
        } else {
            return res.status(500).send(error);
        }
    }
});

router.get('/authorize', async function(req: Request, res: Response) {
    const { code, state } = req.query;
    const user = new UserService();

    try {
        await user.authorize(code, state);
        return res.status(200).sendFile(path.join(__dirname + '/../index.html'));
    } catch (error) {
        if (error.message) {
            return res.status(400).send({
                message: error.message,
            });
        } else {
            return res.status(500).send(error);
        }
    }
});

export { router };
