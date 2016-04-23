//
//  BrushPass.cpp
//  SmudgeVJ
//
//  Created by 麦 on 4/22/16.
//
//

#include "BrushPass.h"


void BrushPass::allocate(int w, int h) {
	setSize(w, h);
	reload();
}

void BrushPass::reload() {
	ofLog(OF_LOG_NOTICE, "update BrushPass shader");
	shader.load("shaders/passthru.vert", "shaders/brush-pass.frag");
}

void BrushPass::setSize(int w, int h) {
	width = w;
	height = h;
	pingPong.allocate(width, height, GL_RGB);
}

void BrushPass::update() {
	pingPong.dst->begin();
	{
		shader.begin();
		
		shader.setUniform2f("resolution", width, height);
//		shader.setUniform1f("maskOpacity", maskOpacity);
		shader.setUniform1f("opacity", opacity);
		shader.setUniform1f("speed", speed);
		shader.setUniform1f("offset", offset);
		shader.setUniform1f("fade", fade);
		shader.setUniform1i("flowType", flowType);
		shader.setUniformTexture("prevTex", pingPong.src->getTexture(), 0);
		shader.setUniformTexture("coatTex", *coat, 1);
//		shader.setUniformTexture("maskTex", *mask, 2);
		
		ofDrawRectangle(0, 0, width, height);
		
		shader.end();
	}
	pingPong.dst->end();
	pingPong.swap();
}



ofTexture& BrushPass::getTexture() {
	return pingPong.dst->getTexture();
}

void BrushPass::draw() {
	pingPong.dst->draw(0, 0);
}