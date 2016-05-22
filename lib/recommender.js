'use strict'

/**
 * Labeled array.
 */
class LabeledArray extends Array {
  set label(label) {
    this._label = label;
  }
  get label() {
    return this._label;
  }
  static get [Symbol.species]() { return Array; }
}

/**
 * Result structure.
 */
class Result {
  constructor(label) {
    this.label = label;
    this.score = 0;
    this._distances = [];
  }
  set score(score) {
    this._score = score;
  }
  get score() {
    return this._score;
  }
  set distances(dvec) {
    this._distances = dvec;
  }
  get distances() {
    return this._distances;
  }
  set label(label) {
    this._label = label;
  }
  get label() {
    return this._label;
  }
}

/**
 * Tiny Content-Based Recommender System.
 *
 * Provides:
 *  - Multivariate feature vectors
 *  - Custom distance functions
 *  - Selective min-max normalization
 *  - Weight factors
 */
class Recommender {

  /**
   * Asynchronous wrapper for #recommend(opts).
   *
   * @see    #recommend(opts)
   * @param  {Object}  opts The options
   * @return {Promise} prom A promise for the recommend function
   */
  recommendAsync(opts) {
    let self = this;
    return new Promise(function(resolve, reject) {
      try {
        resolve(self.recommend(opts));
      } catch(e) {
        reject(e);
      }
    });
  }

  /**
   * Computes the weighted average distance for mixed data types
   * and delivers an array of results ordered by score in relation
   * to a target item.
   *
   * Options structure:
   * ```
   * {
   *   // The target item
   *   target: targetItem,
   *   // The items of the feature space
   *   items: items,
   *   // The data schema (index based)
   *   schema: [
   *     {
   *       normalized: true,
   *       weight: 1,
   *       // You can provide your own functions
   *       distance: Distances.absDiff
   *     },
   *     { ... }
   *   ]
   * }
   * ```
   *
   * Item structure:
   * ```
   * {
   *   label: 'My tag',
   *   features: {
   *     expensiveness: 0,
   *     velocity: 1,
   *     amenities: [1, 1, 1],
   *     ife: true,
   *     ...
   *   }
   * }
   * ```
   * NOTE: the feature set must keep the same order for all items.
   *
   * @param  {Object} opts    The options
   * @return {Array}  results An ordered array with the results
   */
  recommend(opts) {
    let target  = this._extract(opts.target),
        norm    = this._needNormalization(opts),
        wtotal  = this._totalWeight(opts),
        space   = this._load(opts.items),
        results = [],
        max     = [],
        min     = [];

    space.forEach(function(f) {
      let result = new Result(f.label);
      
      // Compute the distance vector
      result.distances = target.map(
        (x, i) => opts.schema[i].distance(x, f[i])
      );

      if(norm) { this._findMinMax(result, opts, min, max); }

      results.push(result);
    }, this);

    // Weighted average
    results.forEach(function (result) {
      let dvec = result.distances;
      for(var i = 0; i < dvec.length; i++) {
        let v = dvec[i];
        result.score += opts.schema[i].weight *
          (opts.schema[i].normalized ? v :
           this._normalize(v, min[i], max[i]));
      }
      result.score /= wtotal;
    }, this);

    // Sort by score and return
    return results.sort( (a, b) => a.score - b.score );
  }

  _findMinMax(r, opts, min, max) {
    let dvec = r.distances;
    for(var i = 0; i < dvec.length; i++) {
      let v = dvec[i];
      if(!opts.schema[i].normalized) {
        // Calculate minimum and maximum for features
        // requiring normalization
        max[i] = max[i] ? Math.max(max[i], v) : v;
        min[i] = min[i] ? Math.min(min[i], v) : v;
      }
    }
  }

  _totalWeight(opts) {
    let sum = 0;
    for(let o of opts.schema) {
      sum += (o.weight || 1);
    }
    return sum;
  }

  _normalize(v, min, max) {
    return (v - min) / (max - min);
  }

  _needNormalization(opts) {
    return opts.schema.find(
      (x) => x.normalized === false
    );
  }

  _load(items) {
    items = Array.isArray(items) ? items : [items];
    let res = [];

    for(let item of items) {
      res.push(this._extract(item));
    }
    
    return res;
  }

  _extract(obj) {
    let larr = new LabeledArray();
    larr.label = obj.label;
    Object.keys(obj.features).forEach(
      key => larr.push(obj.features[key])
    );
    return larr;
  }
}

module.exports = Recommender;
