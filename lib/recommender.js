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
    this._distanceVector = [];
  }
  set score(score) {
    this._score = score;
  }
  get score() {
    return this._score;
  }
  set distanceVector(dvec) {
    this._distanceVector = dvec;
  }
  get distanceVector() {
    return this._distanceVector;
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
   * @param {Object} opts The options
   * @return {Promise} a promise for the recommend function
   * @see #recommend(opts)
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
   * @param {Object} opts The options
   * @return {Array} an ordered array with the results
   */
  recommend(opts) {
    let target  = this._extract(opts.target),
        norm    = this._needNormalization(opts),
        wtotal  = this._totalWeight(opts),
        space   = [],
        results = [],
        max     = [],
        min     = [];

    this._load(opts.items, space);

    space.forEach(function(f) {
      let result = new Result(f.label);
      
      // Compute the distance vector
      result.distanceVector = target.map(
        (x, i) => opts.schema[i].distance(x, f[i])
      );

      if(norm) { this._findMinMax(result, opts, min, max); }

      results.push(result);
    }, this);

    // Weighted average
    results.forEach(function (result) {
      let dvec = result.distanceVector;
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
    let dvec = r.distanceVector;
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

  _load(items, dest) {
    items = Array.isArray(items) ? items : [items];
    for(let item of items) {
      dest.push(this._extract(item));
    }
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
