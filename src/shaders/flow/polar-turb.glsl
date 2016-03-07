#pragma glslify: snoise2 = require(glsl-noise/simplex/2d)
#pragma glslify: PI = require('glsl-pi')

uniform float aspect;
uniform float frequency;
uniform float speed;
uniform float seed;

varying vec2 pos;

vec2 main() {
	vec2 perlin = (pos + vec2(seed)  * 20.0) * frequency * vec2(1.0, aspect);
	float angle = snoise2(perlin) * 2.0 * PI;
	return speed * vec2(cos(angle), sin(angle));
}

#pragma glslify: export(main)
