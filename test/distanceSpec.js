'use strict'
let should    = require('should'),
    Distances = require('../').Distances;

describe('Distances', function() {
  describe('#absDiff()', function () {
    it('should compute absolute differences', function () {
      Distances.absDiff(0, 0).should.be.equal(0);
      Distances.absDiff(-1, -1).should.be.equal(0);
      Distances.absDiff(-1, 0).should.be.equal(1);
      Distances.absDiff(-1, 1).should.be.equal(2);
      Distances.absDiff(2, -3).should.be.equal(5);
      Distances.absDiff(2, 3).should.be.equal(1);
      Distances.absDiff(-4, -3).should.be.equal(1);
      Distances.absDiff(3, 7).should.be.equal(4);
    });
  });
  describe('#manhattan()', function () {
    it('should compute manhattan distance', function () {
      Distances.manhattan([0,3,4,5], [7,6,3,-1])
        .should.be.equal(17);
    });
  });
  describe('#canberra()', function () {
    it('should compute canberra distance', function () {
      Distances.canberra([0,3,4,5], [7,6,3,-1])
        .should.be.approximately(2.476, 0.1);
    });
  });
  describe('#SMD()', function () {
    it('should compute SMD', function () {
      Distances.SMD([1,1,1,1], [0,1,0,0])
        .should.be.equal(0.75);
      Distances.SMD([1,1,1,1], [0,1,0,1])
        .should.be.equal(0.5);
    });
  });
  describe('#hamming()', function () {
    it('should compute hamming distance', function () {
      Distances.hamming(true, true)
        .should.be.equal(0);
      Distances.hamming(false, true)
        .should.be.equal(1);
      Distances.hamming(false, false)
        .should.be.equal(0);
      Distances.hamming(true, false)
        .should.be.equal(1);
      Distances.hamming(2, 2)
        .should.be.equal(0);
      Distances.hamming(2, 2000)
        .should.be.equal(1);
      Distances.hamming('karolin', 'karolin')
        .should.be.equal(0);
      Distances.hamming('karolin', 'kathrin')
        .should.be.equal(3);
      Distances.hamming('2173896', '2233796')
        .should.be.equal(3);
    });
  });
});
