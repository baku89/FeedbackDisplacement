#pragma glslify: snoise2 = require(glsl-noise/simplex/2d)
#pragma glslify: snoise3 = require(glsl-noise/simplex/3d)
#pragma glslify: PI = require(glsl-pi)

vec2 polarTurb(vec4 cur, vec4 origin, vec2 uv) {
	vec2 perlin = (uv * 20.0) * 1.5;
	float angle = snoise2(perlin) * 2.0 * PI;

	float brightness = (origin.r + origin.b + origin.g) / 3.0;
	float amp = mix(0.0, 1.0, brightness) * speed * 0.5;

	return vec2(cos(angle), sin(angle)) * amp;
}
