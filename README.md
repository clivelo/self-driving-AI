# Self-driving Car AI

A simulated self-driving car AI coded in Javascript, using p5.js for animation and visualization, tensorflow for neural network. AI car is trained using an evolutionary algorithm. The car's "brain" consists of an artificial neural network that uses distance sensors that are placed around the car as inputs and driving directions as outputs. A high fitness score can be achieved by successfully going through checkpoints scattered throughout the track as quickly as possible. A car "fails" if it crashes into obstacles, goes back to the previous checkpoint, or run out of time.

## Track
A track consists of walls that the car may crash into. Scattered throughout the track are checkpoints (colored as yellow) that serve as milestones that increase the fitness score of a car. A lap's start and finish (colored as green) acts as a checkpoint, it also serves to count the number of laps a car has finished.

## Neural Network
The neural network is constructed using the TensorFlow library. It consists of three layers. The input layer consists of 20 nodes, they correspond to the distance between each of the 20 sensors and the closest wall in its given direction. They are connected to one dense layer that consists of 8 nodes, which is then connected to the output layers consisted of 4 nodes. The output of the neural network is the four movements that a car can operate (i.e., forward, backward, rotate left, rotate right).
<img src=img/github/nn2.png width=600>

## Evolutionary Algorithm


## Future Direction
Train car AI with a variety of tracks to improve generalizability.
