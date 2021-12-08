function getModel() {
  
  const model = tf.sequential();
  const inputSize = 20;
  
  model.add(tf.layers.dense({inputShape: [inputSize], units: inputSize, activation: "relu"}));
  model.add(tf.layers.dense({units: 8, activation: "relu"}));
  model.add(tf.layers.dense({units: 4, activation: "softmax"}));
  
  return model;
}

function predict(model, inputs) {
  
  // TODO: Normalize inputs
  return model.predict(tf.tensor(inputs, [1, 20])).dataSync();
  
}

function selectParents(fits, count) {
  
    var outp = [];
    for (var i = 0; i < fits.length; i++) {
        outp.push(i);
        if (outp.length > count) {
            outp.sort(function(a, b) { return fits[b] - fits[a]; });
            outp.pop();
        }
    }
    return outp;
  
}

function crossover(parentA, parentB) {
  
  weightA = [];
  weightB = [];
  for (var k = 0; k < parentA.getWeights().length; k += 2) {
    weightA.push(parentA.getWeights()[k].clone());
    weightB.push(parentB.getWeights()[k].clone());
  }
  len = weightA.map(w => w.length);
  sum = len.reduce((a, b) => a + b, 0) - 1;
  cumsum = [0, ...len.map((sum => value => sum += value)(0))];
  
  // Randomly get a gene
  gene = Math.floor(Math.random() * (sum - 0 + 1)) + 0;
  
  var x = 0;
  var y = 0;
  for (var i = 1; i < cumsum.length; i++) {
    if (cumsum[i] > gene) {
      x = i - 1;
      break;
    }
  }
  y = gene - cumsum[x];
  console.log(len, gene, x, y)
  
  geneA = weightA[x][y];
  geneB = weightB[x][y];
  
  weightA[x][y] = geneB;
  weightB[x][y] = geneA;
}

function mutateChild(model, rate = 0.1, mutateFunction) {
  
  tf.tidy(() => {
    const weights = model.getWeights();
    const mutatedWeights = [];
    for (let i = 0; i < weights.length; i += 1) {
      const tensor = weights[i];
      const { shape } = weights[i];
      // TODO: Evaluate if this should be sync or not
      const values = tensor.dataSync().slice();
      for (let j = 0; j < values.length; j += 1) {
        if (Math.random() < rate) {
          if (mutateFunction) {
            values[j] = mutateFunction(values[j]);
          } else {
            values[j] = Math.min(Math.max(values[j] + randomGaussian(), -1), 1);
          }
        }
      }
      const newTensor = tf.tensor(values, shape);
      mutatedWeights[i] = newTensor;
    }
    model.setWeights(mutatedWeights);
  });
  
}
