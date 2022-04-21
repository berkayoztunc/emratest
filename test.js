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
                                
                // Asserts
                expect(res.status).to.be.equal(200); //normal expect with no custom output message
                //expect(res.status,"Status is not 400 (NOT FOUND)").to.be.equal(400); //custom output message at fail
                
                expect(res.body).to.be.a('object');
                expect(res.body.message).to.be.equal('success');
                done();              
            });
    });
})