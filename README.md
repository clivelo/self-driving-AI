# Self-driving Car AI

A simulated self-driving car AI coded in Javascript, using p5.js for animation and visualization, TensorFlow for neural network. AI car is trained using an evolutionary algorithm. The car's "brain" consists of an artificial neural network that uses distance sensors placed around the car as inputs and driving directions as outputs. A high fitness score can be achieved by successfully going through checkpoints scattered throughout the track as quickly as possible. A car "fails" if it crashes into obstacles, goes back to the previous checkpoint, or run out of time.

## Track
A track consists of walls that the car may crash into. Scattered throughout the track are checkpoints (colored as yellow) that serve as milestones that increase the fitness score of a car. A lap's start and finish (colored as green) acts as a checkpoint, it also serves to count the number of laps a car has finished.

## Neural Network
The neural network is constructed using the TensorFlow library. It consists of three layers. The input layer consists of 20 nodes, they correspond to the distance between each of the 20 sensors and the closest wall in its given direction. They are connected to one dense layer that consists of 8 nodes, which is then connected to the output layer consisted of 4 nodes. The output of the neural network is the four movements that a car can operate (i.e., forward, backward, rotate left, rotate right).
<img src=img/github/nn2.png width=600></img>

## Fitness Score
Cars are rewarded for moving quickly around the track, passing checkpoints, and being close to the next checkpoint upon crashing. Fitness score begins at 50, with a decrement of 0.5 for every tick passed. Every checkpoint rewards 100 points. If a car has crashed, additional fitness score is added by rewarding for being close to the next checkpoint and penalized for being close to the previous checkpoint.

## Evolutionary Algorithm
In the first generation, 70 cars were generated with randomized neural network weights. The two cars with the highest fitness score are selected to be the parents of the next generation. Their weights are crossovered to produce a new generation of cars with a small mutation chance for each weight. Parents are preserved for the next generation as a failsafe for when none of the new generation performs better than their parents.

## Future Direction
- Train car AI with a variety of tracks to improve generalizability.
- Improve car physics.
