#version 120
#define GLSLIFY 1

uniform vec2 resolution;

varying vec2 uv;
varying vec2 coord;

void main(){
	coord = gl_Vertex.xy;
	uv = gl_Vertex.xy / resolution;

	gl_Position = gl_ProjectionMatrix * gl_ModelViewMatrix * gl_Vertex;
}
