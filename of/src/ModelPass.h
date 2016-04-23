//
//  mesh.h
//  SmudgeVJ
//
//  Created by 麦 on 4/21/16.
//
//

#pragma once

#include "ofMain.h"
#include "ofxAssimpModelLoader.h"
#include "ofxJSON.h"
#include "Config.h"

#include "CameraAnimation.h"

// camList: array of cameras
// cam: array of CamAnime instances
// frame: a frame

class ModelPass {
	
public:
	
	void setup();
	void reload();
	
	void setSize(int width, int height);
	
	void draw();
	void exit();
	
	ofTexture *src;
	
	void setCamIndex(int index);
	void setModelIndex(int index);
	
	float displacement = 1.0;
	float volume = 0;
	float bgIntensity = 0.0;
	
private:
	
	int camIndex = 0;
	int modelIndex = 0;
	
	ofFbo composited;
	ofFbo ajusted;
	ofFbo dst;
	
	vector<vector<CameraAnimation>> multicamList;
	ofCamera cam;
	ofShader shader, compositeShader, ajustShader;
	ofxAssimpModelLoader assimp;

};
