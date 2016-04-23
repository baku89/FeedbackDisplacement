#pragma glslify: snoise2 = require(glsl-noise/simplex/2d)
#pragma glslify: snoise3 = require(glsl-noise/simplex/3d)
#pragma glslify: PI = require(glsl-pi)

//--------------------------------------------------
vec2 polarTurb(vec4 prev, vec4 coat, vec2 uv) {
	vec2 perlin = (uv + vec2(offset)  * 20.0) * 1.5;
	float angle = snoise2(perlin) * 2.0 * PI;

	float brightness = (coat.r + coat.b + coat.g) / 3.0;
	float amp = mix(0.0, 1.0, brightness) * speed * 0.5;

	return vec2(cos(angle), sin(angle)) * amp;
}

//--------------------------------------------------
vec2 directionalDisp(vec4 prev, vec4 coat, vec2 uv) {
	float brightness = (coat.r + coat.b + coat.g) / 3.0;
	float amp = brightness * speed * 0.75; //(snoise3(prev.rgb) / 2.0 + 0.5) * speed * 1.0;
	float angle = (floor(offset * 4.0) / 4.0 + 0.125) * (PI * 2.0);

 	return amp * vec2(cos(angle), sin(angle));
}

//--------------------------------------------------
vec2 earthworm(vec4 prev, vec4 coat, vec2 uv) {
	float wiggle = snoise2( (uv + offset) * 2.0);
	float dir = offset * PI * 2.0;
	float angle = wiggle * 2.0 * PI + (cos(dir) * uv.x + sin(dir) * uv.y) * 80.0;
	float amp = mix(0.0, 1.0, (coat.r + coat.g + coat.b) / 3.0) * speed;

 	return vec2(cos(angle), sin(angle)) * amp * 0.5;
}

//--------------------------------------------------
vec2 colorDir(vec4 prev, vec4 coat, vec2 uv) {
	float angle = (prev.r - prev.g + offset) * PI * 2.0;

	float brightness = (coat.r + coat.g + coat.b) / 3.0;
	float amp = mix( 0.1, 1.0, brightness) * speed * 0.75;

	return vec2(cos(angle), sin(angle)) * amp;
}

//--------------------------------------------------
vec2 imageDisp(vec4 prev, vec4 coat, vec2 uv) {
	float amp = (coat.r + coat.g - coat.b) / 3.0 * speed;
	float angle = (offset + snoise2(uv / 1.5)) * PI * 2.0;

	return amp * vec2(cos(angle), sin(angle));
}

//--------------------------------------------------
vec2 circle(vec4 prev, vec4 coat, vec2 uv) {
	float angle = atan(0.5 - uv.x, uv.y - 0.5) + snoise2(uv + offset * 100.0) * PI * 0.5;

	float brightness = (coat.r + coat.g + coat.b) / 3.0;
	float amp = mix(0.0, 1.0, brightness) * speed;

	return amp * vec2(cos(angle), sin(angle));
}

//--------------------------------------------------
vec2 flow(vec4 prev, vec4 coat, vec2 uv) {

 if (flowType == 0) {
 	return circle(prev, coat, uv);
 } else if (flowType == 1) {
 	return imageDisp(prev, coat, uv);
 } else if (flowType == 2) {
 	return directionalDisp(prev, coat, uv);
 } else if (flowType == 3) {
 	return earthworm(prev, coat, uv);
 } else if (flowType == 4) {
 	return colorDir(prev, coat, uv);
 } else if (flowType == 5) {
 	return polarTurb(prev, coat, uv);
 }
}

#pragma glslify: export(flow)