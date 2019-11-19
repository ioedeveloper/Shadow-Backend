import * as  dotenv from 'dotenv';
dotenv.config();

export default {
    host: process.env.NODE_ENV === 'development' ? 'https://a4f546eb.ngrok.io' :  'https://gitshadow.herokuapp.com',
};
