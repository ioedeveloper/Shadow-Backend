process.env.NODE_ENV = 'development';
import chai from 'chai';
import chaiHttp = require('chai-http');
import 'mocha';
import server from '../server';

chai.use(chaiHttp);

const expect: Chai.ExpectStatic = chai.expect;
let app: Express.Application, request: ChaiHttp.Agent;

describe ('User API', async function() {
    this.timeout(120000);

    before(async function() {
        app = await server;
        request = await chai.request(app);
    });

    after(function(done) {
        done();
    });

    let token;

    it('Should signup a new user and generate an extension ID', function(done) {
        request.post('/user/signup')
        .send({})
        .end(function(error, response) {
            expect(response).status(200);
            expect(response.body).to.have.property('extensionId');
            expect(response.body).to.have.property('tokens');
            token = response.body.tokens.jwtAccessToken;
            done();
        });
    });
});
