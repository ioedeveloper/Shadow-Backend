import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import * as appConfig from '../config';
import { UserDataService } from '../service/userDataService';
import { IUserJWTSignature } from '../config/types/user';

export async function isAuthorized(req: Request, res: Response, next: NextFunction) {
    const accessCode = req.headers['authorization'];

    if (!accessCode) {
        return res.status(401).send({
            message: 'Access Code Missing',
        });
    } else {
        const token = accessCode.split(' ')[1];

        try {
            const decoded = await jwt.verify(token, appConfig.default.jwtSecretKey);
            const userDataService = new UserDataService();

            if ((decoded as IUserJWTSignature).id) {
                try {
                    await userDataService.update({
                        _id: (decoded as IUserJWTSignature).id,
                        lastActive: new Date(),
                    });
                } catch (error) {
                    return res.status(401).send({
                        message: 'Last Active Update Failed!',
                    });
                }
                next();
            }
        } catch (error) {
            return res.status(401).send({
                message: 'Unauthorized User.',
            });
        }
    }
}
