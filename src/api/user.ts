import * as express from 'express';
import { Request, Response } from 'express';
import { UserService } from '../service/userService';
import * as jwt from 'jsonwebtoken';
import * as  dotenv from 'dotenv';
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
    if (!data.email) {
        return res.status(400).send({ message: 'User Email is Required.' });
    }
    if (!data.extensionId) {
        return res.status(400).send({ message: 'VSCode Extension Id is Required.'});
    }
    if (await userService.checkUserExist(data)) {
        return res.status(400).send({ message: 'User Already Exist. Please login with user details.'});
    }
    try {
        const newUser = await userService.addUser(data);
        const response = {
            id: newUser._id,
            email: newUser.email,
            tokens: {
                jwtAccessToken: `${jwt.sign({
                    id: newUser._id,
                    email: newUser.email,
                }, process.env.JWT_SECRET_KEY as string, { expiresIn: 5600000 })}`,
                jwtRefreshToken: newUser.jwtRefreshToken,
            },
        };
        return res.status(200).send({ data: response });
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
 * EndPoint: /user/login
 * @param Request
 * @param Response
 * @description Login endpoint for existing users.
 */
router.post('/login', async function(req: Request, res: Response) {
    const data = req.body;
    if (!data.email) {
        return res.status(400).send({
            message: 'Email Address is required.',
        });
    }
    if (!data.extensionId) {
        return res.status(400).send({
            message: 'ExtensionID is required.',
        });
    }
    try {
        const user = await userService.login(data);
        const response = {
            id: user._id,
            email: user.email,
            tokens: {
                jwtAccessToken: `${jwt.sign({
                    id: user._id,
                    email: user.email,
                }, process.env.JWT_SECRET_KEY as string, { expiresIn: 5600000 })}`,
                jwtRefreshToken: user.jwtRefreshToken,
            },
        };
        return res.status(200).send({ data: response });
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
