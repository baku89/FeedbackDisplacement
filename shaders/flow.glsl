#pragma glslify: snoise2 = require(glsl-noise/simplex/2d)
#pragma glslify: snoise3 = require(glsl-noise/simplex/3d)
#pragma glslify: PI = require('glsl-pi')

// vec2 polarTurb(vec2 aspect, float speed, float seed, vec3 prevColor, vec3 coatColor) {
// 	vec2 perlin = (pos + vec2(seed)  * 20.0) * 2.0 * vec2(1.0, aspect);
// 	float angle = snoise2(perlin) * 2.0 * PI;

// 	// vec3 ic = texture2D(image, pos / vec2(2.0, 1.0)).rgb;
// 	float br = (coatColor.r + coatColor.b + coatColor.g) / 3.0;
// 	float amp = mix(0.2, 1.0, br) * speed;

// 	return vec2(cos(angle), sin(angle)) * amp;
// }

// vec2 directionalDisp() {
// 	vec3 color = texture2D(prev, pos).rgb;
// 	float amp = snoise3(color + seed * 100.0) * speed * 2.0;
// 	float angle = (floor(seed * 1000.0) + 0.5) * (PI / 2.0);

// 	return amp * vec2(cos(angle), sin(angle));
// }

// vec2 earthworm() {
// 	vec3 color = texture2D(image, pos / vec2(2.0, 1.0)).rgb;

// 	float wiggle = snoise2( (pos + seed) * frequency * 2.0 );
// 	float dir = seed * PI * 2.0;
// 	float angle = wiggle * 2.0 * PI + (cos(dir) * pos.x + sin(dir) * pos.y) * 80.0;
// 	float amp = mix(0.1, 1.0, (color.r + color.g + color.b) / 3.0) * speed / 1.2;

// 	return vec2(cos(angle), sin(angle)) * amp;
// }

// vec2 colorDir() {
// 	vec3 pc = texture2D(prev, pos).rgb;
// 	float angle = (pc.r - pc.g + seed * 10.0) * PI * 1.0;

// 	vec3 ic = texture2D(image, pos).rgb;
// 	float br = (ic.r + ic.g + ic.b) / 3.0;
// 	float amp = mix( 0.1, 1.0, br) * speed;

// 	return vec2(cos(angle), sin(angle)) * amp;
// }

// vec2 imageDisp() {
// 	vec3 color = texture2D(image, pos).rgb;
// 	float amp = (color.r + color.g - color.b) / 3.0 * speed;
// 	float angle = (seed + snoise2(pos / 1.5)) * PI * 2.0;

// 	return amp * vec2(cos(angle), sin(angle));
// }

// vec2 circle() {
// 	float angle = atan(0.5 - pos.x, (pos.y - 0.5) * aspect) + snoise2(pos * vec2(1.0, aspect) + seed * 100.0) * PI * 0.5;

// 	vec3 ic = texture2D(image, pos).rgb;
// 	float br = (ic.r + ic.g + ic.b) / 3.0;
// 	float amp = mix(-1.0, 1.0, br) * speed;

// 	return amp * vec2(cos(angle), sin(angle));
// }

//--------------------------------------------------
vec2 flow(int type) {

	return simple();

	// if (flowType == 0) {
	// 	offset = circle();
	// } else if (flowType == 1) {
	// 	offset = imageDisp();
	// } else if (flowType == 2) {
	// 	offset = directionalDisp();
	// } else if (flowType == 3) {
	// 	offset = earthworm();
	// } else if (flowType == 4) {
	// 	offset = colorDir();
	// } else if (flowType == 5) {
	// 	offset = polarTurb();
	// }

}




#pragma glslify: export(flow)