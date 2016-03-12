#version 120
#define GLSLIFY 1

uniform vec2 resolution;

varying vec2 uv;
varying vec2 pos;

void main(){
	
	uv = gl_Vertex.xy / resolution;
	pos = gl_Vertex.xy / vec2(resolution.x, resolution.x);

	gl_Position = gl_ProjectionMatrix * gl_ModelViewMatrix * gl_Vertex;
}
