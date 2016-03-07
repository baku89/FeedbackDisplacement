vec4 compileOffset(vec2 offset, float aspect) {

	vec2 o = offset / vec2(1.0, aspect);
	o = (o + 1.0) / 2.0;

	return vec4(o.x, o.y, 0.0, 1.0);
}

#pragma glslify: export(compileOffset)
