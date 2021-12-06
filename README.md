## Introduction

These pieces were originally created to be performed in a concert setting, in a dim room with a large screen or projector.
They explore the relationships between music, sound, video, mathematical equations and physical phenomena.
Some of them have a fixed compositional structure; others are meant to be used in improvisation, being controlled using a MIDI device.

## Table of Contents

- [Waves](#waves)
- [Phi](#phi)
- [Shapes](#shapes)
- [Red green](#red-green)


# Waves

[https://sytzez.github.io/audiovisual/waves.html](https://sytzez.github.io/audiovisual/waves.html)

## Concept

This piece explores using [wave functions](https://en.wikipedia.org/wiki/Wave_function) from [quantum physics](https://en.wikipedia.org/wiki/Quantum_mechanics)
as the source of audio and video generation.
Wave functions show the probability of a particle to be at any given location. 
When bounded in a 'box', as used in the piece, this can result in [standing waves](https://en.wikipedia.org/wiki/Standing_wave) (see picture below)
which means it can produce the frequencies of the [harmonic series](https://en.wikipedia.org/wiki/Harmonic_series_(music)),
relating it to [harmony](https://en.wikipedia.org/wiki/Harmony) in music.

![](https://upload.wikimedia.org/wikipedia/commons/2/27/Quantum_mechanics_standing_wavefunctions.svg)

[Schroedinger's equation](https://en.wikipedia.org/wiki/Schr%C3%B6dinger_equation) is used to calculate how the wave function evolves over time.
Practically, it comes down to shifting the phase of the real and imaginary sine waves that make up the wave function.
This can create an [oscillatory motion](https://en.wikipedia.org/wiki/Oscillation) inside the wavefunction (see picture below), 
relating it to [rhythm](https://en.wikipedia.org/wiki/Rhythm) in music.

![](https://upload.wikimedia.org/wikipedia/commons/9/90/QuantumHarmonicOscillatorAnimation.gif)

## Technique

A [GLSL fragment shader](https://www.khronos.org/opengl/wiki/Fragment_Shader) is used to calculate the wave function at every frame, for every pixel at the screen.
To improve performance, I factored out all calculations that remain the same over all frames, so they only have to be calculated once.
The results of these calculations are passed into the shader as a WebGL texture with only the alpha channel.
After this performance improvement, the amount of sine calculations required per pixel per frame was drastically reduced.

To create the "bouncing ball" effect that shows up at some point in the piece,
a [Fourier transform](https://en.wikipedia.org/wiki/Fourier_transform) is used to turn 
a 2D [normal distribution](https://en.wikipedia.org/wiki/Normal_distribution) (essentially the shape of a ball)
into a series of sine waves at different frequencies. 

The colors that eventually appear in the piece are created by outputting the real and imaginary part of the wave function onto different color channels (RGB channels).

## Results


# Phi

[https://sytzez.github.io/audiovisual/phi.html](https://sytzez.github.io/audiovisual/phi.html)

## Concept

In music and sound in general, the [harmonic series](https://en.wikipedia.org/wiki/Harmonic_series_(music)) is seen as the basis for [timbre](https://en.wikipedia.org/wiki/Timbre)
and [harmony](https://en.wikipedia.org/wiki/Harmony).
One reason for this is that when different frequencies from a harmonic series are played together, they form a single repeated wave at the root frequency of the series.
In other words, all the waves fit neatly together and the result sounds pleasing to the ear. 
*With this piece I propose a new way of structuring frequencies, that has the same harmonious properties as the harmonic series.*

![](/phi/octaves-phi.jpg)

A series of octaves, having frequencies of factors `1, 2, 4, 8...`, sound perfectly consonant because the 
[nodes](https://en.wikipedia.org/wiki/Node_(physics)) line up in many places (see left graph).
In this piece however, the waves are irregular, alternating between short (`S`) and long (`L`) wavelengths (see right graph).
This alternating wave is produced at frequencies of factors `1, φ, φ², φ³...`, φ being the [golden ratio](https://en.wikipedia.org/wiki/Golden_ratio).
As you can see in the graph, these waves also have many nodes that line up, just like the octaves, resulting in a consonant sound.

The reason for the nodes lining up lies in the specific specific sequence of long (`L`) and short (`S`) wavelengths.
This sequence can be constructed using an algorithm similar to how the [fibonacci sequence](https://en.wikipedia.org/wiki/Fibonacci_number) is calculated:
1. Start out with `L` `S`
2. Take the first part (`L`) and add it to the end. Group together the original sequence (`L` `S` -> `L S`). Result: `L S` `L`
3. Take the first part (`L S`) and add it to the end. Group together the original sequence. Result: `L S L` `L S`
4. Keep repeating this step. `L S L L S` `L S L`
5. `L S L L S L S L` `L S L L S`
6. ...ad infinitum

This results in a sequence that can continue infinitely without repeating itself. Yet it is self-similar when viewed at different speeds. For example: `L S` together could be equivalent `L` in a slower tempo, and `L` could be equivalent to `S` in a slower tempo. This would produce the following two perfectly aligning layers:
```
L S|L|L S|L S|L S|L|L S
L  |S|L  |L  |L  |S|L
```
This self-similarity, which continues into infinity when you keep slowing the tempo, makes this sequence a [fractal](https://en.wikipedia.org/wiki/Fractal).


## Technique

## Results



# Shapes

[https://sytzez.github.io/audiovisual/shapes.html](https://sytzez.github.io/audiovisual/shapes.html)

## Concept

This piece uses [ray tracing](https://en.wikipedia.org/wiki/Ray_tracing_(graphics)) to create many kinds of visual landscapes. It adds noise at various parts of the algorithm to created visual distortions.

## Technique

The distance from the "camera" to the shapes at each pixel are approximated using [Newton's method](https://en.wikipedia.org/wiki/Newton%27s_method).
The field of general distance to the shape at each point is precalculated into a 3D texture, and passed into a fragment shader that performs Newton's method.
The audio is created by scanning the visual image at each frame and turning the brightness value into the amplitude of a wave.

## Results


# Red green

[https://sytzez.github.io/audiovisual/rg.html](https://sytzez.github.io/audiovisual/rg.html)

## Concept

## Technique

## Results
