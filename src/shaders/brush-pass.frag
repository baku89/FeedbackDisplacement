precision mediump float;

#pragma glslify: combineAlpha = require('./combine-alpha.glsl')
#pragma glslify: snoise2 = require(glsl-noise/simplex/2d)
#pragma glslify: snoise3 = require(glsl-noise/simplex/3d)
#pragma glslify: PI = require('glsl-pi')

uniform sampler2D prev;
uniform sampler2D image;
uniform float imageOpacity;

// flow
uniform int flowType;
uniform float aspect;
uniform float frequency;
uniform float speed;
uniform float seed;

varying vec2 pos;

vec2 polarTurb() {
	vec2 perlin = (pos + vec2(seed)  * 20.0) * frequency * vec2(1.0, aspect);
	float angle = snoise2(perlin) * 2.0 * PI;
	return speed * vec2(cos(angle), sin(angle));
}

vec2 directionalDisp() {
	vec3 color = texture2D(prev, pos).rgb;
	float amp = snoise3(color + seed * 100.0) * speed * 2.0;

	float angle = (floor(seed * 1000.0) + 0.5) * (PI / 2.0);

	return amp * vec2(cos(angle), sin(angle));
}

void main() {

	// uneune
	// float angle = snoise2(((pos + seed) / 1000.) * frequency) * 2.0 * PI + (pos.x + pos.y - 1.0) * 40.0;
	// vec2 vel = vec2(cos(angle), sin(angle)) * speed;

	// uneune
	// vec2 perlin = (pos + vec2(seed)  * 20.0) * frequency * vec2(1.0, aspect);
	// float angle = snoise2(perlin) * 2.0 * PI;
	// vec2 vel = vec2(cos(angle), sin(angle) / aspect) * speed;

	vec2 offset = vec2(0.0);

	if (flowType == 0) {
		offset = directionalDisp();
	} else if (flowType == 1) {
		offset = polarTurb();
	}

	// fix aspect
	offset /= vec2(1.0, aspect);

	vec2 originPos = pos + offset;
	// vec2 originPos = fract(pos + vel);

	vec4 coatColor = combineAlpha(image, pos);
	vec4 prevColor = texture2D(prev, originPos);

	vec3 color = mix(prevColor.rgb, coatColor.rgb, coatColor.a * imageOpacity);

	gl_FragColor = vec4(color, 1.0);

}
