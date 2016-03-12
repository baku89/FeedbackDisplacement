#pragma glslify: snoise2 = require(glsl-noise/simplex/2d)
#pragma glslify: snoise3 = require(glsl-noise/simplex/3d)
#pragma glslify: PI = require(glsl-pi)

vec2 polarTurb(vec4 prev, vec4 coat, vec2 pos) {
 	vec2 perlin = (pos + vec2(offset)  * 20.0) * 2.0;
 	float angle = snoise2(perlin) * 2.0 * PI;

 	float brightness = (coat.r + coat.b + coat.g) / 3.0;
 	float amp = mix(0.2, 1.0, brightness) * speed;

 	return vec2(cos(angle), sin(angle)) * amp;
 }

 vec2 directionalDisp(vec4 prev, vec4 coat, vec2 pos) {
 	float amp = snoise3(prev.rgb + offset * 100.0) * speed * 2.0;
 	float angle = (floor(offset * 1000.0) + 0.5) * (PI / 2.0);

 	return amp * vec2(cos(angle), sin(angle));
 }

 vec2 earthworm(vec4 prev, vec4 coat, vec2 pos) {
 	float wiggle = snoise2( (pos + offset) * 4.0 );
 	float dir = offset * PI * 2.0;
 	float angle = wiggle * 2.0 * PI + (cos(dir) * pos.x + sin(dir) * pos.y) * 80.0;
 	float amp = mix(0.1, 1.0, (coat.r + coat.g + coat.b) / 3.0) * speed / 1.2;

 	return vec2(cos(angle), sin(angle)) * amp;
 }

 vec2 colorDir(vec4 prev, vec4 coat, vec2 pos) {
 	float angle = (prev.r - prev.g + offset) * PI * 2.0;

 	float brightness = (coat.r + coat.g + coat.b) / 3.0;
 	float amp = mix( 0.1, 1.0, brightness) * speed;

 	return vec2(cos(angle), sin(angle)) * amp;
 }

 vec2 imageDisp(vec4 prev, vec4 coat, vec2 pos) {
 	float amp = (coat.r + coat.g - coat.b) / 3.0 * speed;
 	float angle = (offset + snoise2(pos / 1.5)) * PI * 2.0;

 	return amp * vec2(cos(angle), sin(angle));
 }

 vec2 circle(vec4 prev, vec4 coat, vec2 pos) {
 	float angle = atan(0.5 - pos.x, pos.y - 0.5) + snoise2(pos + offset * 100.0) * PI * 0.5;

 	float brightness = (coat.r + coat.g + coat.b) / 3.0;
 	float amp = mix(-1.0, 1.0, brightness) * speed;

 	return amp * vec2(cos(angle), sin(angle));
 }

//--------------------------------------------------
vec2 flow(vec4 prev, vec4 coat, vec2 pos) {

	 if (flowType == 0) {
	 	return circle(prev, coat, pos);
	 } else if (flowType == 1) {
	 	return imageDisp(prev, coat, pos);
	 } else if (flowType == 2) {
	 	return directionalDisp(prev, coat, pos);
	 } else if (flowType == 3) {
	 	return earthworm(prev, coat, pos);
	 } else if (flowType == 4) {
	 	return colorDir(prev, coat, pos);
	 } else if (flowType == 5) {
	 	return polarTurb(prev, coat, pos);
	 }

}




#pragma glslify: export(flow)