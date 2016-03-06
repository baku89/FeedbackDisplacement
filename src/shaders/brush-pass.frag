precision mediump float;

#pragma glslify: snoise2 = require(glsl-noise/simplex/2d)
#pragma glslify: PI = require('glsl-pi')

uniform sampler2D prev;
uniform sampler2D image;
uniform vec2 resolution;
uniform vec2 cursor;
uniform float imageOpacity;
uniform float frequency;
uniform float speed;


varying vec2 pos;

void main() {

	// uneune
	// float angle = snoise2((pos + cursor / resolution) * frequency) * 2.0 * PI + (pos.x + pos.y - 1.0) * 40.0;
	// vec2 vel = vec2(cos(angle), sin(angle)) * speed;

	vec2 vel = vec2(0.0, 0.0);

	vec3 imageColor = texture2D(image, pos).rgb;
	vec3 prevColor = texture2D(prev, pos + vel).rgb;

	vec3 color = mix(prevColor, imageColor, imageOpacity);

	gl_FragColor = vec4(color, 1.0);

}
