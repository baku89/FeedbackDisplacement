#version 120
#define GLSLIFY 1

uniform vec2 resolution;
uniform vec2 texResolution;
// uniform float maskOpacity;
uniform float opacity;

// flow attribute

uniform float speed;
uniform float offset;
uniform float fade;
uniform int flowType;

//
// Description : Array and textureless GLSL 2D simplex noise function.
//      Author : Ian McEwan, Ashima Arts.
//  Maintainer : ijm
//     Lastmod : 20110822 (ijm)
//     License : Copyright (C) 2011 Ashima Arts. All rights reserved.
//               Distributed under the MIT License. See LICENSE file.
//               https://github.com/ashima/webgl-noise
//

vec3 mod289_0(vec3 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec2 mod289_0(vec2 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec3 permute_0(vec3 x) {
  return mod289_0(((x*34.0)+1.0)*x);
}

float snoise_0(vec2 v)
  {
  const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0
                      0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)
                     -0.577350269189626,  // -1.0 + 2.0 * C.x
                      0.024390243902439); // 1.0 / 41.0
// First corner
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);

// Other corners
  vec2 i1;
  //i1.x = step( x0.y, x0.x ); // x0.x > x0.y ? 1.0 : 0.0
  //i1.y = 1.0 - i1.x;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  // x0 = x0 - 0.0 + 0.0 * C.xx ;
  // x1 = x0 - i1 + 1.0 * C.xx ;
  // x2 = x0 - 1.0 + 2.0 * C.xx ;
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;

// Permutations
  i = mod289_0(i); // Avoid truncation effects in permutation
  vec3 p = permute_0( permute_0( i.y + vec3(0.0, i1.y, 1.0 ))
    + i.x + vec3(0.0, i1.x, 1.0 ));

  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m ;
  m = m*m ;

// Gradients: 41 points uniformly over a line, mapped onto a diamond.
// The ring size 17*17 = 289 is close to a multiple of 41 (41*7 = 287)

  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;

// Normalise gradients implicitly by scaling m
// Approximation of: m *= inversesqrt( a0*a0 + h*h );
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );

// Compute final noise value at P
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

//
// Description : Array and textureless GLSL 2D/3D/4D simplex
//               noise functions.
//      Author : Ian McEwan, Ashima Arts.
//  Maintainer : ijm
//     Lastmod : 20110822 (ijm)
//     License : Copyright (C) 2011 Ashima Arts. All rights reserved.
//               Distributed under the MIT License. See LICENSE file.
//               https://github.com/ashima/webgl-noise
//

vec3 mod289_1(vec3 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 mod289_1(vec4 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 permute_1(vec4 x) {
     return mod289_1(((x*34.0)+1.0)*x);
}

vec4 taylorInvSqrt(vec4 r)
{
  return 1.79284291400159 - 0.85373472095314 * r;
}

float snoise_1(vec3 v)
  {
  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

// First corner
  vec3 i  = floor(v + dot(v, C.yyy) );
  vec3 x0 =   v - i + dot(i, C.xxx) ;

// Other corners
  vec3 g_0 = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g_0;
  vec3 i1 = min( g_0.xyz, l.zxy );
  vec3 i2 = max( g_0.xyz, l.zxy );

  //   x0 = x0 - 0.0 + 0.0 * C.xxx;
  //   x1 = x0 - i1  + 1.0 * C.xxx;
  //   x2 = x0 - i2  + 2.0 * C.xxx;
  //   x3 = x0 - 1.0 + 3.0 * C.xxx;
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y
  vec3 x3 = x0 - D.yyy;      // -1.0+3.0*C.x = -0.5 = -D.y

// Permutations
  i = mod289_1(i);
  vec4 p = permute_1( permute_1( permute_1(
             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

// Gradients: 7x7 points over a square, mapped onto an octahedron.
// The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)
  float n_ = 0.142857142857; // 1.0/7.0
  vec3  ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,7*7)

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)

  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4( x.xy, y.xy );
  vec4 b1 = vec4( x.zw, y.zw );

  //vec4 s0 = vec4(lessThan(b0,0.0))*2.0 - 1.0;
  //vec4 s1 = vec4(lessThan(b1,0.0))*2.0 - 1.0;
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);

//Normalise gradients
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

// Mix final noise value
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),
                                dot(p2,x2), dot(p3,x3) ) );
  }

const float PI = 3.14159265359;

//--------------------------------------------------
vec2 polarTurb(vec4 prev, vec4 coat, vec2 uv) {
	vec2 perlin = (uv + vec2(offset)  * 20.0) * 1.5;
	float angle = snoise_0(perlin) * 2.0 * PI;

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
	float wiggle = snoise_0( (uv + offset) * 2.0);
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
	float angle = (offset + snoise_0(uv / 1.5)) * PI * 2.0;

	return amp * vec2(cos(angle), sin(angle));
}

//--------------------------------------------------
vec2 circle(vec4 prev, vec4 coat, vec2 uv) {
	float angle = atan(0.5 - uv.x, uv.y - 0.5) + snoise_0(uv + offset * 100.0) * PI * 0.5;

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

uniform sampler2DRect prevTex;
uniform sampler2DRect coatTex;
// uniform sampler2DRect maskTex;

varying vec2 uv;
varying vec2 coord;

float brightness (vec4 c) {
	return (c.r + c.g + c.b) / 3.0;
}

void main() {
	
	// get original color
	vec4 prev = texture2DRect(prevTex, coord);
	vec4 coat = texture2DRect(coatTex, coord);
	// float mask = texture2DRect(maskTex, coord).r;
	
	// get flow and offset point of prev
	vec2 duv = uv;
	duv += flow(prev, coat, uv);
	duv = mod(duv, resolution);

	vec2 dcoord = duv * resolution;

	prev = texture2DRect(prevTex, dcoord) * vec4(fade, fade, fade, 1.0);

	// mix
	vec3 c = prev.rgb;

	if (1.0 - opacity < brightness(coat)) {
		c = coat.rgb;
	}

	// c = mix(c, coat.rgb, mask * maskOpacity);

  gl_FragColor = vec4(c.r, c.g, c.b, 1.0);
}