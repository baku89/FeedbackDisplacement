//
//  DispPass.cpp
//  SmudgeVJ
//
//  Created by 麦 on 4/22/16.
//
//

#include "DispPass.h"

void DispPass::allocate(int w, int h) {
	prevElapsed = ofGetElapsedTimef();
	
	setSize(w, h);
	reload();
}

void DispPass::setSize(int w, int h) {
	width = w;
	height = h;
	
	dst.allocate(w, h, GL_RGB);
}

void DispPass::reload() {
	ofLog(OF_LOG_NOTICE, "update DispPass shader");
	shader.load("shaders/passthru.vert", "shaders/disp-pass.frag");
};

void DispPass::begin() {
	float elapsed = ofGetElapsedTimef();
	time += (elapsed - prevElapsed) * timeSpeed;
	prevElapsed = elapsed;
	
	shader.begin();
	shader.setUniform2f("resolution", width, height);
	shader.setUniform1f("time", time);
	shader.setUniform1f("amp", amp);
	shader.setUniform1f("saturation", saturation);
	shader.setUniform1f("brightness", brightness);
	shader.setUniformTexture("srcTex", *src, 0);
}

void DispPass::end() {
	shader.end();
}

void DispPass::bind() {
	dst.getTexture().bind();
}

void DispPass::unbind() {
	dst.getTexture().unbind();
}

void DispPass::update() {
	dst.begin();
	{
		begin();
		src->draw(0, 0);
		end();
	}
	dst.end();
}

void DispPass::draw() {
	dst.draw(0, 0);
}

ofTexture& DispPass::getTexture() {
	return dst.getTexture();
};