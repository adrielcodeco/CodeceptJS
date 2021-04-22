const faker = require('faker');
const transform = require('../transform');

/**
 * Use the [faker.js](https://www.npmjs.com/package/faker) package to generate fake data inside examples on your gherkin tests
 *
 * ![Faker.js](https://raw.githubusercontent.com/Marak/faker.js/master/logo.png)
 *
 * #### Usage
 *
 * To start please install `faker.js` package
 *
 * ```
 * npm install -D faker
 * ```
 *
 * ```
 * yarn add -D faker
 * ```
 *
 * Add this plugin to config file:
 *
 * ```js
 * plugins: {
 *    fakerTransform: {
 *      enabled: true
 *    }
 * }
 * ```
 *
 * Add the faker API using a mustache string format inside examples tables in your gherkin scenario outline
 *
 * ```feature
 * Scenario Outline: ...
 *             Given ...
 *              When ...
 *              Then ...
 *         Examples:
 *   | productName          | customer              | email              | anythingMore |
 *   | {{commerce.product}} | Dr. {{name.findName}} | {{internet.email}} | staticData   |
 * ```
 *
 * Ensure unique fake data using @unique tag in the Examples like:
 *
 * ```feature
 * Scenario Outline: ...
 *             Given ...
 *              When ...
 *              Then ...
 *         @unique
 *         Examples:
 *   | productName          | customer              | email              | anythingMore |
 *   | {{commerce.product}} | Dr. {{name.findName}} | {{internet.email}} | staticData   |
 * ```
 *
 *  You can change the behavior of the unique in the config file:
 *
 * ```js
 * plugins: {
 *    fakerTransform: {
 *      enabled: true,
 *      unique: {
 *        maxRetries: 10,
 *        maxTime: 10
 *      }
 *    }
 * }
 * ```
 *
 */
module.exports = function (config) {
  transform.addTransformerBeforeAll('gherkin.examples', (value, { examples }) => {
    const tags = examples.tags.map(t => t.name);
    const unique = tags.includes('@unique');
    let result = value;
    if (typeof value === 'string' && value.length > 0) {
      if (unique) {
        if (/\{\{.*\}\}/g.test(value)) {
          result = faker.unique(() => faker.fake(value), undefined, config.unique);
        }
      } else {
        result = faker.fake(value);
      }
    }
    return result;
  });
};
