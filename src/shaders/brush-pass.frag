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
	vec3 color = texture2D(prev, pos).rgb;
	vec2 perlin = (pos + vec2(seed)  * 20.0) * frequency * vec2(1.0, aspect);
	float angle = snoise2(perlin) * 2.0 * PI;
	return speed * vec2(cos(angle), sin(angle)) * mix(0.2, 1.0, color.r);
}

vec2 directionalDisp() {
	vec3 color = texture2D(prev, pos).rgb;
	float amp = snoise3(color + seed * 100.0) * speed * 2.0;
	float angle = (floor(seed * 1000.0) + 0.5) * (PI / 2.0);

	return amp * vec2(cos(angle), sin(angle));
}


vec2 earthworm() {
	float wiggle = snoise2( (pos + seed) * frequency * 2.0 );
	float dir = seed * PI * 2.0;
	float angle = wiggle * 2.0 * PI + (cos(dir) * pos.x + sin(dir) * pos.y) * 80.0;

	return vec2(cos(angle), sin(angle)) * speed * 0.8;
}

vec2 colorDir() {
	vec3 c = texture2D(prev, pos).rgb;
	float angle = (c.r - c.g + seed * 10.0) * PI * 1.0;

	return vec2(cos(angle), sin(angle)) * speed;
}

vec2 imageDisp() {
	vec3 color = texture2D(image, pos / vec2(2.0, 1.0)).rgb;
	float amp = (color.r + color.b - color.b) / 2.0 * speed;
	float angle = (seed + snoise2(pos / 1.0)) * PI * 2.0;

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
		offset = polarTurb();
	} else if (flowType == 1) {
		offset = imageDisp();
	} else if (flowType == 2) {
		offset = directionalDisp();
	} else if (flowType == 3) {
		offset = earthworm();
	} else if (flowType == 4) {
		offset = colorDir();
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
