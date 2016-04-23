//
//  Model.cpp
//  SmudgeVJ
//
//  Created by 麦 on 4/22/16.
//
//

#include "ModelPass.h"



void ModelPass::setup() {
	reload();
	setSize(RENDER_WIDTH, RENDER_HEIGHT);
	
	assimp.loadModel("models.obj");
	
	ofxJSONElement result;
	
	bool parsingSuccessful = result.open("multicam.json");
	
	if (parsingSuccessful) {
		
		
		for (int mi = 0; mi < 2; mi++) {
			
			// start model------------------------------
			int camNum = result[mi]["count"].asInt();
			vector<CameraAnimation> camList;
			
			// every cam
			for (int i = 0; i < camNum; i++) {
				// container
				CameraAnimation ca;
				
				// json
				ofxJSONElement camResult = result[mi]["camList"][i];
				
				int duration = camResult["duration"].asInt();
				
				ofLogNotice() << "cam" << i << ": duration=" << duration << endl;
				
				// everyframe
				for (int f = 0; f < duration; f++) {
					ofMatrix4x4 m(camResult["matrices"][f][0].asFloat(),
								  camResult["matrices"][f][1].asFloat(),
								  camResult["matrices"][f][2].asFloat(),
								  camResult["matrices"][f][3].asFloat(),
								  
								  camResult["matrices"][f][4].asFloat(),
								  camResult["matrices"][f][5].asFloat(),
								  camResult["matrices"][f][6].asFloat(),
								  camResult["matrices"][f][7].asFloat(),
								  
								  camResult["matrices"][f][8].asFloat(),
								  camResult["matrices"][f][9].asFloat(),
								  camResult["matrices"][f][10].asFloat(),
								  camResult["matrices"][f][11].asFloat(),
								  
								  camResult["matrices"][f][12].asFloat(),
								  camResult["matrices"][f][13].asFloat(),
								  camResult["matrices"][f][14].asFloat(),
								  camResult["matrices"][f][15].asFloat()
								  );
					
					ca.addMatrix(m);
					ca.addFov(camResult["fovs"][f].asFloat());
				}
				camList.push_back(ca);
			}
			
			multicamList.push_back(camList);
			// end model------------------------------
		}
	
	}
}

void ModelPass::reload() {
	ofLog(OF_LOG_NOTICE, "update Model shader");
	shader.load("shaders/model.vert", "shaders/model.frag");
	compositeShader.load("shaders/passthru.vert", "shaders/model-composite.frag");
	ajustShader.load("shaders/passthru.vert", "shaders/model-ajust.frag");
}

void ModelPass::setSize(int w, int h) {
	ofFbo::Settings s;
	s.width = w;
	s.height = h;
	s.useDepth = true;
	s.depthStencilAsTexture = true;
	
	composited.allocate(s);
	
	s.useDepth = false;
	s.depthStencilAsTexture = false;
	ajusted.allocate(s);
	dst.allocate(s);
}


void ModelPass::draw() {
	
	composited.begin();
	ofBackground(0);
	ofEnableDepthTest();
	{
		
		
		float f = int(ofGetElapsedTimef() * 30.0f);
		ofMatrix4x4 m = multicamList[modelIndex][camIndex].getMatrixAtFrame(f);
		float fov = multicamList[modelIndex][camIndex].getFovAtFrame(f);
		
		cam.setTransformMatrix(m);
		cam.setFov(fov);
		cam.begin();
		
	//	cout << "pos=" << m.getTranslation() << "fov=" << fov << endl;
		
		
//		ofDrawAxis(100);
//		ofDrawGrid(20, 40, true);
		
		
		shader.begin();
		shader.setUniformTexture("srcTex", *src, 0);
		shader.setUniform2f("resolution", CANVAS_WIDTH, CANVAS_HEIGHT);
		shader.setUniform1f("time", ofGetElapsedTimef());
		shader.setUniform1f("displacement", displacement);
		shader.setUniform1f("volume", volume);
		{
		
			ofSetColor(255);
			assimp.getMesh(modelIndex).drawFaces();
		}
		shader.end();
		cam.end();
	
	}
	ofDisableDepthTest();
	composited.end();
	
	// 2. composite
	ajusted.begin();
	{
		compositeShader.begin();
		compositeShader.setUniformTexture("colorTex", composited.getTexture(), 0);
		compositeShader.setUniformTexture("depthTex", composited.getDepthTexture(), 1);
		compositeShader.setUniform2f("resolution", ofGetWidth(), ofGetHeight());
		compositeShader.setUniform1f("bgIntensity", bgIntensity);
		
//		cout << bgIntensity << endl;
		{
			ofDrawRectangle(0, 0, RENDER_WIDTH, RENDER_HEIGHT);
		}
	}
	ajusted.end();
	
	
	// 3. post-effect
	dst.begin();
	{
		ajustShader.begin();
		ajustShader.setUniformTexture("srcTex", ajusted.getTexture(), 0);
		ajustShader.setUniformTexture("depthTex", composited.getDepthTexture(), 1);
		ajustShader.setUniform2f("resolution", ofGetWidth(), ofGetHeight());
		{
			ofDrawRectangle(0, 0, RENDER_WIDTH, RENDER_HEIGHT);
		}
		ajustShader.end();
	}
	dst.end();
	
	// 4. render
	float w = float(ofGetWidth());
	float h = float(ofGetHeight());
	
	float s = h / RENDER_HEIGHT;
	float fw = ofGetHeight() * RENDER_ASPECT;
	
	ofPushMatrix();
	ofTranslate((fw - w) / -2.0, 0);
	ofScale(s, s);
	ofSetColor(255);
	dst.draw(0, 0);
	
//	ofPopMatrix();
//	composited.draw(0, 0, 100, 100);
//	composited.getDepthTexture().draw(100, 0, 100, 100);
}



void ModelPass::setCamIndex(int index) {
	if (multicamList[modelIndex].size() <= index) {
		index = multicamList[modelIndex].size() - 1;
	}
	camIndex = index;
	ofLogNotice() << "cam set=" << index;
}

void ModelPass::setModelIndex(int index) {
	if (assimp.getMeshCount() <= index) {
		index = assimp.getMeshCount() - 1;
	}
	modelIndex = index;
	ofLogNotice() << "model set=" << index;
	
	setCamIndex(camIndex);
	ofLogNotice() << "------";
}

void ModelPass::exit() {
}