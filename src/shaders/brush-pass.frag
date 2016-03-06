precision mediump float;

#pragma glslify: snoise2 = require(glsl-noise/simplex/2d)
#pragma glslify: PI = require('glsl-pi')

uniform sampler2D prev;
uniform sampler2D image;
uniform float aspect;
uniform vec2 cursor;
uniform float imageOpacity;
uniform float frequency;
uniform float speed;
uniform float speedAmp;
uniform float seed;


varying vec2 pos;

void main() {

	// uneune
	// float angle = snoise2((pos + cursor / resolution) * frequency) * 2.0 * PI + (pos.x + pos.y - 1.0) * 40.0;
	// vec2 vel = vec2(cos(angle), sin(angle)) * speed;

	// uneune
	float angle = snoise2((pos + vec2(seed * 20.0, seed * 10.0)) * frequency) * 2.0 * PI;
	vec2 vel = vec2(cos(angle), sin(angle) / aspect) * speed * speedAmp;

	// vec2 vel = vec2(0.0, 0.0);

	vec2 originPos = pos + vel;//fract(pos + vel);

	vec3 imageColor = texture2D(image, pos).rgb;
	vec3 prevColor = texture2D(prev, originPos).rgb;

	vec3 color = mix(prevColor, imageColor, imageOpacity);

	gl_FragColor = vec4(color, 1.0);

}
