const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
const server = require('./index');
var mocha = require('mocha')
var describe = mocha.describe
var it = mocha.it
chai.use(chaiHttp);
describe('User workflow tests', () => {
    it('should accept parameter', (done) => {
        let data = {
            data : {
                count : 2, 
                emre : {
                    count : 3
                }
            }
        }
        chai.request(server)
            .post('/track')
            .send(data)
            .end((err, res) => {
                expect(res.status).to.be.equal(200); 
                expect(res.body).to.be.a('object');
                expect(res.body.message).to.be.equal('success');
                done();              
            });
    });
})