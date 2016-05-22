'use strict'
let should = require('should'),
    data   = require('./data/travel'),
    tico   = require('../'),
    Distances   = tico.Distances,
    Recommender = tico.Recommender;

describe('Recommender', function() {
  describe('#recommend()', function () {
    it('should rank offers for traveler 1 preferences', function () {
      let rec = new Recommender(),
          res = rec.recommend({
            target: data.traveler1,
            items: data.offers,
            schema: [
              { 
                normalized: true,
                weight: 1,
                distance: Distances.abs
              },
              { 
                normalized: true,
                weight: 1,
                distance: Distances.abs
              },
              { 
                normalized: true,
                weight: 1,
                distance: Distances.SMD
              },
              { 
                normalized: true,
                weight: 1,
                distance: Distances.hamming
              },
              { 
                normalized: true,
                weight: 1,
                distance: Distances.canberra
              },
              { 
                normalized: false,
                weight: 1,
                distance: Distances.abs
              }
            ]
          });
     
      console.log(res);

      (res).should.be.an.Array;
      (res).should.not.be.empty;
    });
  });
});
