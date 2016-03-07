
vec4 combineAlpha(sampler2D tex, vec2 p) {
	p.x = (p.x / 2.0) * 0.995;
	vec2 colorPos = vec2(p.x, p.y);
	vec2 alphaPos = vec2(0.5 + p.x, p.y);
	return vec4(texture2D(tex, colorPos).rgb, texture2D(tex, alphaPos).r);
}

#pragma glslify: export(combineAlpha)
