import * as  dotenv from 'dotenv';
dotenv.config();

export default {
    host: process.env.NODE_ENV === 'development' ? 'https://55293a2b.ngrok.io' :  'https://gitshadow.herokuapp.com',
    jwtSecretKey: process.env.JWT_SECRET_KEY ? process.env.JWT_SECRET_KEY : 'git-shadow',
};
