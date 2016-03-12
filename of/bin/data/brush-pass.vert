#version 120
#define GLSLIFY 1

uniform vec2 resolution;

varying vec2 pos;

void main(){
	pos = gl_Vertex.xy / resolution;

	gl_Position = gl_ProjectionMatrix * gl_ModelViewMatrix * gl_Vertex;
}
