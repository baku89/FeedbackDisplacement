varying vec2 pos;

void main(void) {
	pos = vec2(uv.x, uv.y);
	gl_Position = vec4(position, 1.0);
}
