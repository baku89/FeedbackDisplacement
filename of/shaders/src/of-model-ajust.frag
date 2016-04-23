#version 120

uniform sampler2DRect srcTex;
uniform sampler2DRect depthTex;

uniform vec2 resolution;

varying vec2 uv;
varying vec2 coord;

//---------------------------------------------
vec2 barrelDistortion(vec2 coord, float amt) {
  vec2 cc = coord - 0.5;
  float dist = dot(cc, cc);
  return coord + cc * dist * amt;
}

float sat(float t) {
  return clamp( t, 0.0, 1.0 );
}

float linterp(float t) {
  return sat(1.0 - abs(2.0 * t - 1.0));
}

float remap(float t, float a, float b) {
  return sat((t - a) / (b - a));
}

vec4 spectrum_offset(float t) {
  vec4 ret;
  float lo = step(t, 0.5);
  float hi = 1.0 - lo;
  float w = linterp(remap(t, 1.0 / 6.0, 5.0 / 6.0));
  ret = vec4(lo, 1.0, hi, 1.) * vec4(1.0 - w, w, 1.0 - w, 1.);
  return pow(ret, vec4(1.0 / 2.2));
}


vec4 chromaticAberration() { 
  const float max_distort = 4.0;
  const int num_iter = 9;//12;
  const float reci_num_iter_f = 1.0 / float(num_iter);

  vec4 sumcol = vec4(0.0);
  vec4 sumw = vec4(0.0);  
  for (int i = 0; i < num_iter; i++){
    float t = float(i) * reci_num_iter_f;
    vec4 w = spectrum_offset(t);
    sumw += w;
    sumcol += w * texture2DRect(srcTex, barrelDistortion(uv, .04 * max_distort * t) * resolution);
  }
    
  return sumcol / sumw;
}
//---------------------------------------------

void main() {

	vec4 c = chromaticAberration();
	// float d = texture2DRect(depthTex, coord).r;
					 
	// d = smoothstep(0.9, 1.0, d);
	// c = mix(c, vec4(0.0, 0.0, 0.0, 1.0), d);

	gl_FragColor = c;
}