//
//  RenderPass.h
//  of
//
//  Created by Baku Hashimoto on 3/13/16.
//
//

#pragma once

#include "ofMain.h"

#include "Config.h"

class DispPass {
public:
	
	void allocate(int w, int h);
	void setSize(int w, int h);
	void reload();
	void update();
	void draw();
	
	void begin();
	void end();
	void bind();
	void unbind();
	
	ofTexture& getTexture();
	
	float time = 0.0;
	float timeSpeed = 1.0;
	float amp = 0.0;
	
	ofFbo dst;
	ofTexture *src;
	ofShader shader;
	int width, height;
	float saturation = 0.75;
	float brightness = 0.0;
	
	
private:
	float prevElapsed;
};