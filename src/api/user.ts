import * as express from 'express';
import { Request, Response } from 'express';
import { UserService } from '../service/userService';
import * as  dotenv from 'dotenv';
import * as path from 'path';
import * as jwt from 'jsonwebtoken';
import * as appConfig from '../config';
import { isAuthorized } from '../middleware/authorization';
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

    try {
        const newUser = await userService.addUser();
        const response = {
            extensionId: newUser.extensionId,
            tokens: {
                jwtAccessToken: `${
                    jwt.sign({
                        id: newUser._id,
                    }, appConfig.default.jwtSecretKey, { expiresIn: 3600000 })
                }`,
                jwtRefreshToken: newUser.jwtRefreshToken,
            },
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

    if (!data.extensionId) {
        return res.status(400).send({
            message: 'ExtensionID is required.',
        });
    }
    try {
        const user = await userService.login(data);
        const response = {
            extensionId: user.extensionId,
            tokens: {
                jwtAccessToken: `${
                    jwt.sign({
                        id: user._id,
                    }, appConfig.default.jwtSecretKey, { expiresIn: 3600000 })
                }`,
                jwtRefreshToken: user.jwtRefreshToken,
            },
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
 * EndPoint: /user/authorize
 * @param Request
 * @param Response
 * @description Redirect Endpoint for Github Authentication Complete.
 */
router.get('/authorize', async function(req: Request, res: Response) {
    const { code, state } = req.query;

    try {
        await userService.authorize(code, state);
        return res.status(200).sendFile(path.resolve('public/views/auth_success.html'));
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
 * EndPoint: /user/accessCode
 * @param Request
 * @param Response
 * @description Access Code endpoint to retrieve user accessCode.
 */
router.get('/accessCode', isAuthorized, async function(req: Request, res: Response) {
    const { extensionId } = req.query;

    try {
        const accessCode = await userService.getAccessCode(extensionId);

        return res.status(200).send({
            accessCode,
        });
    } catch (error) {
        if (error.message) {
            return res.status(400).send({
                message: error.message,
            });
        }
        return res.status(500).send(error);
    }
});

export { router };
