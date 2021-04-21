const transformers = {
  'gherkin.examples': [],
};

function transform(target, value, context) {
  if (target in transformers) {
    for (const transform of transformers[target]) {
      value = transform(value, context);
    }
  }
  return value;
}

transform.addTransformer = function (target, transformer) {
  if (target in transformers) {
    transformers[target].push(transformer);
  }
};

transform.addTransformerBeforeAll = function (target, transformer) {
  if (target in transformers) {
    transformers[target].unshift(transformer);
  }
};

module.exports = transform;
