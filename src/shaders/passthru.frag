precision mediump float;

uniform vec2 resolution;
uniform vec2 cursor;
uniform sampler2D texture;

varying vec2 pos;

void main() {

	vec4 color = texture2D(prev, pos);

	// vec4 color = texture2D(texture, pos);
	// float dist = distance(pos, cursor / resolution);
	// vec4 circle = vec4(dist, dist, dist, 1.0);

	gl_FragColor = color + circle;

}
