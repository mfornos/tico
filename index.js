/**
 * Tico library.
 *
 * @export {Recommender} Recommender The recommendation engine class
 * @export {Distances}   Distances   The distance functions holder
 */
module.exports = {
  Recommender: require('./lib/recommender'),
  Distances  : require('./lib/distances')
};