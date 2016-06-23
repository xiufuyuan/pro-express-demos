var superagent = require('superagent');
var expect = require('expect.js');

describe('express rest api server', function () {
  var id;

  var url = 'http://localhost:3000/collections/test';

  it('posts an object', function (done) {
    superagent.post(url)
      .send({name: 'longer', email: 'longer@163.com'})
      .end(function (e, res) {
        //console.log(res.body);
        expect(e).to.eql(null);
        expect(res.body.length).to.eql(1);
        expect(res.body[0]._id.length).to.eql(24);
        id = res.body[0]._id;
        done();
      });
  });

  it('retrieves an object', function (done) {
    superagent.get(url + '/' + id)
      .end(function (e, res) {
        //console.log(res.body);
        expect(e).to.eql(null);
        expect(typeof res.body).to.eql('object');
        expect(res.body._id).to.eql(id);
        expect(res.body._id.length).to.eql(24);
        done();
      });
  });

  it('retrieves a collection', function (done) {
    superagent.get(url)
      .end(function (e, res) {
        //console.log(res.body);
        expect(e).to.eql(null);
        expect(res.body.length).to.be.above(0);
        expect(res.body.map(function (item) {
          return item._id;
        })).to.contain(id);
        done();
      });
  });

  it('updates an object', function (done) {
    superagent.put(url + '/' + id)
      .send({name: 'xiufu', email: 'hahaha@163.com'})
      .end(function (e, res) {
        //console.log(res.body);
        expect(e).to.eql(null);
        expect(typeof res.body).to.eql('object');
        expect(res.body.msg).to.eql('success');
        done();
      });
  });

  it('checks an updated object', function (done) {
    superagent.get(url + '/' + id)
      .end(function (e, res) {
        //console.log(res.body);
        expect(e).to.eql(null);
        expect(typeof res.body).to.eql('object');
        expect(res.body._id.length).to.eql(24);
        expect(res.body._id).to.eql(id);
        expect(res.body.name).to.eql('xiufu');
        done();
      });
  });

  it('removes an object', function (done) {
    superagent.del(url + '/' + id)
      .end(function (e, res) {
        //console.log(res.body);
        expect(e).to.eql(null);
        expect(typeof res.body).to.eql('object');
        expect(res.body.msg).to.eql('success');
        done();
      });
  });

});