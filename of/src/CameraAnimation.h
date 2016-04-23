//
//  CamAnimation.h
//  SmudgeVJ
//
//  Created by 麦 on 4/22/16.
//
//

#pragma once

#include "ofMain.h"
#include <math.h>

float mix(float a, float b, float t) {
	return a + (b-a) * t;
}

class CameraAnimation {
	
public:
	
	int getDuration() {
		return matrices.size();
	}
	
	void addMatrix(ofMatrix4x4 m) {
		matrices.push_back(m);
	}
	
	void addFov(float fov){
		fovs.push_back(fov);
	}
	
	ofMatrix4x4 getMatrixAtFrame(int frame) {
		/*
		ofMatrix4x4 m1 = matrices[ ceil(frame) % matrices.size()  ];
		ofMatrix4x4 m2 = matrices[ floor(frame) % matrices.size() ];
		float it = modf(frame);
		
		ofMatrix4x4 m;
		
		for (int i = 0; i < 16; i++) {
			m[i] = mix(m1[i], m2[i], it);
		}
		return m.normalize();
		 */
		
		return matrices[ int(frame) % matrices.size() ];
	}
	
	float getFovAtFrame(float frame) {
		/*
		float f1 = fovs[ ceil(frame) % fovs.size()  ];
		float f2 = fovs[ floor(frame) % fovs.size() ];
		float it = modf(frame);
		
		return mix(f1, f2, it);
		 */
		
		return fovs[ int(frame) % fovs.size() ];
	}
	
private:
	int duration = 0;
	vector<ofMatrix4x4> matrices;
	vector<float> fovs;
};