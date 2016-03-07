precision mediump float;

#pragma glslify: snoise2 = require(glsl-noise/simplex/2d)
#pragma glslify: PI = require('glsl-pi')

#pragma glslify: combineAlpha = require('./combine-alpha.glsl')

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
	// float angle = snoise2(((pos + seed) / 1000.) * frequency) * 2.0 * PI + (pos.x + pos.y - 1.0) * 40.0;
	// vec2 vel = vec2(cos(angle), sin(angle)) * speed;

	// uneune
	vec2 perlin = (pos + vec2(seed)  * 20.0) * frequency * vec2(1.0, aspect);
	float angle = snoise2(perlin) * 2.0 * PI;
	vec2 vel = vec2(cos(angle), sin(angle) / aspect) * speed * speedAmp;

	// normal
	// vec2 vel = vec2(0.0, 0.0);

	vec2 originPos = pos + vel;
	// vec2 originPos = fract(pos + vel);

	vec4 coatColor = combineAlpha(image, pos);
	vec4 prevColor = texture2D(prev, originPos);

	vec3 color = mix(prevColor.rgb, coatColor.rgb, coatColor.a * imageOpacity);

	gl_FragColor = vec4(color, 1.0);

}
