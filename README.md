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

Duration: 9 minutes

View: [https://sytzez.github.io/audiovisual/waves.html](https://sytzez.github.io/audiovisual/waves.html)

## Concept

This piece explores the use of [wave functions](https://en.wikipedia.org/wiki/Wave_function) from [quantum physics](https://en.wikipedia.org/wiki/Quantum_mechanics)
in audio and video generation.
A wave function is a probability field, showing how likely it is for a particle to be at a given location within the field. 
When a particle is bounded in a 'box', with barriers around it, the wave function may contain [standing waves](https://en.wikipedia.org/wiki/Standing_wave) (see picture below), which is employed in the piece.
This means the wave function can produce the frequencies of the [harmonic series](https://en.wikipedia.org/wiki/Harmonic_series_(music)),
relating it to [harmony](https://en.wikipedia.org/wiki/Harmony) in music.

![](https://upload.wikimedia.org/wikipedia/commons/2/27/Quantum_mechanics_standing_wavefunctions.svg)

[Schroedinger's equation](https://en.wikipedia.org/wiki/Schr%C3%B6dinger_equation) is used to calculate how a wave function evolves over time.
Practically, it comes down to shifting the [phase](https://en.wikipedia.org/wiki/Phase_(waves)) of the real and imaginary sine waves that make up the wave function.
This may result in an [oscillatory motion](https://en.wikipedia.org/wiki/Oscillation) inside the wavefunction (see picture below), 
relating it to [rhythm](https://en.wikipedia.org/wiki/Rhythm) in music.

![](https://upload.wikimedia.org/wikipedia/commons/9/90/QuantumHarmonicOscillatorAnimation.gif)

## Technique

A [GLSL fragment shader](https://www.khronos.org/opengl/wiki/Fragment_Shader) is used to calculate the wave function at every frame, calculating its value at every pixel.
To improve performance, I factored out all calculations that remain the same over all frames, so they only have to be calculated once, before the piece even starts.
The results of these calculations are passed into the shader as a WebGL texture with only the alpha channel.
After this performance improvement, the amount of sine calculations required per pixel per frame was drastically reduced.

To create the "bouncing ball" effect that shows up at some point in the piece,
a [Fourier transform](https://en.wikipedia.org/wiki/Fourier_transform) is used to turn 
a 2D [normal distribution](https://en.wikipedia.org/wiki/Normal_distribution) (essentially the shape of a ball)
into a series of sine waves at different frequencies and phases. 

The colors that eventually appear in the piece are created by outputting the real and imaginary part of the wave function onto different color channels (RGB channels).

## Results

![](/waves/clip-1.gif)
![](/waves/clip-2.gif)
![](/waves/clip-3.gif)
![](/waves/clip-4.gif)

# Phi

No fixed structure

View: [https://sytzez.github.io/audiovisual/phi.html](https://sytzez.github.io/audiovisual/phi.html)

## Concept

In music and sound in general, the [harmonic series](https://en.wikipedia.org/wiki/Harmonic_series_(music)) is seen as the basis for [timbre](https://en.wikipedia.org/wiki/Timbre)
and [harmony](https://en.wikipedia.org/wiki/Harmony).
The reason the harmonic series sounds so good when played together, is that they form a single repeated wave at the root frequency of the series, with no fluctuations over time.
In other words, sound waves with frequencies belonging to the harmonic series fit neatly together, and sound pleasing to the ear. 
*With this piece I propose a new way of structuring frequencies, that has the same harmonious properties as the harmonic series.*

![](/phi/octaves-phi.jpg)

A series of octaves, having frequencies of factors `1, 2, 4, 8...`, sound perfectly consonant because the 
[nodes](https://en.wikipedia.org/wiki/Node_(physics)) of its sound waves line up in many places (see left graph).
Normally, each wave has a constant frequency and a constant wavelength.
In this piece however, the waves are irregular, alternating between short (`S`) and long (`L`) wavelengths (see right graph).
I use this wave at different frequencies of factors `1, φ, φ², φ³...`, φ being the [golden ratio](https://en.wikipedia.org/wiki/Golden_ratio).
As you can see in the graph, these waves also have many nodes that line up, just like the octaves, resulting in a consonant sound.

The reason for the nodes lining up lies in the specific specific sequence of long (`L`) and short (`S`) wavelengths.
This sequence can be constructed using an algorithm similar to how the [fibonacci sequence](https://en.wikipedia.org/wiki/Fibonacci_number) is calculated:
1. Start out with `L` `S`
2. Take the first part (`L`) and add it to the end. Group together the original sequence (`L` `S` -> `L S`). Result: `L S` `L`
3. Take the first part (`L S`) and add it to the end. Group together the original sequence. Result: `L S L` `L S`
4. Keep repeating this step. `L S L L S` `L S L`
5. `L S L L S L S L` `L S L L S`
6. ...repeat ad infinitum

This sequence can continue infinitely without ever repeating itself. It also is self-similar when viewed at different speeds. For example: `L S` together could be equivalent `L` in a slower tempo, and `L` could be equivalent to `S` in that tempo. At an even slower tempo, `L S L` could map to `L`, and `L S` to `S`. This would produce the following three perfectly aligning layers:
```
L|S|L|L|S|L|S|L|L|S|L|L|S|...
L  |S|L  |L  |S|L  |S|L  |...
L    |S  |L    |L    |S  |...
...
```
This self-similarity, which continues into infinity when adding more layers, makes this sequence a [fractal](https://en.wikipedia.org/wiki/Fractal).
When the wavelength of `L` and `S` differ by the [golden ratio](https://en.wikipedia.org/wiki/Golden_ratio) (`φ`), the ratio between `L` and `S` in each
consequent layer will also differ by the golden ratio. This makes it possible to keep adding waves at higher and lower frequencies, which will all have common nodes, as shown in the graph above on the right.

When this sequence is used at lower frequencies, it form rhythms instead of tones. These rhythms overlap at many points, just like the nodes in the tones overlap.
At even lower frequencies the sequences can be used to direct the musical structure, turning certain voices off and on at certain points.

## Technique

The whole concept as explained above boils down to one function, where `x` is a position in time:
```javascript
const phi = (1 + Math.sqrt(5)) * 0.5;
const inverseLnPhi = 1.0 / Math.log(phi);

function phi(x) {
  while (x > phi) {
    x -= Math.pow(phi, Math.floor(Math.log(x) * inverseLnPhi));
  }
  return x;
}
```
The function returns the distance of `x` from the latest `L` or `S` boundary before it.
In other words, it keeps starting from `0` every time it passes an `L` or `S` boundary, and then gradually increases unit it reaches the next boundary and jumps back to `0`.
The function is used as the basis of other function that generate sound waves, rhythm and structure.
The entire piece is generated from this function, though some parameters are left free to be used in improvisation using a MIDI controller.

## Results

![](/phi/ss2_small.png)
Go to [https://sytzez.github.io/audiovisual/phi.html](https://sytzez.github.io/audiovisual/phi.html) to hear audio.

# Shapes

No fixed structure

View: [https://sytzez.github.io/audiovisual/shapes.html](https://sytzez.github.io/audiovisual/shapes.html)

## Concept

This piece uses [ray tracing](https://en.wikipedia.org/wiki/Ray_tracing_(graphics)) to create many kinds of visual landscapes. It adds noise at various parts of the algorithm to created visual distortions.

## Technique

The distance from the "camera" to the shapes at each pixel are approximated using [Newton's method](https://en.wikipedia.org/wiki/Newton%27s_method).
The field of general distance to the shape at each point is precalculated into a 3D texture, and passed into a 
[fragment shader](https://www.khronos.org/opengl/wiki/Fragment_Shader) that performs Newton's method.
The audio is created by scanning the visual image at each frame and turning the brightness value into the amplitude of a wave.
This makes the character of the audio match the character of the visuals, although the audio is less interesting due to the lack of relationship of the calculations to music and the nature of sound.

## Results

![](/shapes/ss.png)

# Red green

Duration: 8 minutes

View: [https://sytzez.github.io/audiovisual/rg.html](https://sytzez.github.io/audiovisual/rg.html)

## Concept

This piece is based on the concept of [signal feedback](https://en.wikipedia.org/wiki/Feedback). At every frame, the image currently on the screen is used to generate the next frame. Different transformations are applied to the image, to make it evolve over time.

## Technique

The image on screen is captured from the canvas element, and drawn as a texture on a WebGL polygon. The polygon is shifted, rotated and stretched slightly to make the feedback loop change the image over time. Audio is generated by scanning a line of the picture and using the brightness values for the amplitude inside the sound wave.

## Results

![](/rg/ss_small.png)
