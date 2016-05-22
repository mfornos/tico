'use strict'

/**
 * Distance functions.
 */
class Distances {

  /**
   * Computes the Canberra distance.
   * Can be used to compare ranked lists.
   *
   * @param {Object} a The first term
   * @param {Object} b The second term
   * @return {number} The Canberra distance between two terms
   */
  static canberra(a, b) {
    var sum = 0;
    for(var i = 0; i < a.length; i++) {
      sum += Distances.absDiff(a[i], b[i]) /
             (Math.abs(a[i]) + Math.abs(b[i]));
    }
    return sum;
  }

  /**
   * Computes the absolute difference.
   * Intended for quantitative data types.
   *
   * @param {number} a The first term
   * @param {number} b The second term
   * @return {number} The absolute diference between two terms
   */
  static absDiff(a, b) {
    return Math.abs(a - b);
  }

  /**
   * Computes the City Block or Manhattan distance.
   * Intended for quantitative vector data types.
   *
   * @param {Array} a The first term
   * @param {Array} b The second term
   * @return {number} The absolute diference between two terms
   */
  static manhattan(a, b) {
    return a.map( (x, i) => Distances.absDiff(x, b[i]) )
            .reduce( (p, x) => p + x );
  }

  /**
   * Computes the Hamming distance.
   * Intended for binary data types and strings.
   *
   * @param {Object} a The first term
   * @param {Object} b The second term
   * @return {number} 0 if the terms are equal, 1 otherwise
   */
  static hamming(a, b) {
    if(Array.isArray(a)) {
      let sum = 0;
      for(var i = 0; i < a.length; i++) {
        sum += this.hamming(a[i], b[i]);
      }
      return sum;
    } else if(typeof a === 'string') {
      return Distances.hamming(
        a.split('').map( (x) => x.charCodeAt(0) ), 
        b.split('').map( (x) => x.charCodeAt(0) )
      );
    }
    return (a === b) ? 0 : 1;
  }

  /**
   * Computes the Simple Matching distance.
   * Can be used to compare distance between vectors when
   * both positive and negative values carry equal
   * information (symmetry).
   *
   * @param {Array} a The first term
   * @param {Array} b The second term
   * @return {number} The SM distance between two terms
   */
  static SMD(a, b) {
    return a.map( (x, i) => Distances.hamming(x, b[i]) )
            .reduce( (p, x) => p + x ) / a.length;
  }

  static _log(r) { console.log(r); return r; }
}

module.exports = Distances;
