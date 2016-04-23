#include "ofApp.h"

//--------------------------------------------------------------
void ofApp::setup(){
	
	ofSetVerticalSync(true);
	//	ofSetFullscreen(true);
	
//    ofSetWindowShape(width, height);
	
    brushPass.allocate(CANVAS_WIDTH, CANVAS_HEIGHT);
	dispPass.allocate(CANVAS_WIDTH, CANVAS_HEIGHT);
    
    receiver.setup(PORT);
    
    coatTex.setup();
    coatTex.set(SYPHON_COAT, SYPHON_APP);
//    maskTex.setup();
//    maskTex.set(SYPHON_MASK, SYPHON_APP);
	
	modelPass.setup();
	
    // set
    brushPass.coat = &coatTex.getTexture();
//    brushPass.mask = &maskTex.getTexture();
	
	modelPass.src = &dispPass.getTexture();
	
	
	audio.init();
}

//--------------------------------------------------------------
void ofApp::exit() {
	modelPass.exit();
}





//--------------------------------------------------------------
void ofApp::setupGui(){
	ofSetBackgroundColor(0);
	
	
	gui = new ofxDatGui(ofxDatGuiAnchor::TOP_LEFT);
	gui->setAutoDraw(false);
    
    gui->addFRM();
    
//    gui->addSlider("flow type", 0, 10)->bind(brushPass.flowType);
//    gui->addSlider("opacity", 0, 1)->bind(brushPass.opacity);
//    gui->addSlider("flow speed", 0, 0.1)->bind(brushPass.speed);
//    gui->addSlider("offset", 0, 1)->bind(brushPass.offset);
//    gui->addSlider("fade", 0, 1)->bind(brushPass.fade);
//	
//	gui->addBreak()->setHeight(40.0f);
//	gui->addSlider("time speed", 0, 2)->bind(dispPass.timeSpeed);
//    
//    gui->addBreak()->setHeight(40.0f);
//    gui->addSlider("saturation", 0, 1)->bind(renderPass.saturation);
//    gui->addSlider("brightness", 0, 1)->bind(renderPass.brightness);
	
    gui->addBreak()->setHeight(40.0f);
    gui->addSlider("volume", 0, 1)->bind(this->audio.volume);
//    gui->addSlider("beat volume", 0, 1)->bind(this->beatVolume);
    gui->addSlider("bg intensity", 0, 1)->bind(this->modelPass.bgIntensity);
	
	gui->setTheme(new ofxDatGuiThemeMidnight());
}

//--------------------------------------------------------------
void ofApp::update(){
	
    while (receiver.hasWaitingMessages()) {
        ofxOscMessage m;
        receiver.getNextMessage(&m);
        
        string address = m.getAddress();
        
        if (address == "/opacity") {
			if (enableOpacity) {
				brushPass.opacity = m.getArgAsFloat(0);
				opacityCount = 6;
			}
		
		} else if (address == "/enable-opacity") {
			enableOpacity = m.getArgAsBool(0);
			
        } else if (address == "/flow-speed") {
            brushPass.speed = m.getArgAsFloat(0);
        
        } else if (address == "/offset") {
            brushPass.offset = m.getArgAsFloat(0);
			
        } else if (address == "/fade") {
            brushPass.fade = m.getArgAsFloat(0);
        
        } else if (address == "/flow-type") {
			brushPass.flowType = m.getArgAsInt(0);
		
		} else if (address == "/time-speed") {
			dispPass.timeSpeed = m.getArgAsFloat(0);
			
        } else if (address == "/saturation") {
            dispPass.saturation = m.getArgAsFloat(0);
		
        } else if (address == "/brightness") {
            dispPass.brightness = m.getArgAsFloat(0);
			
		} else if (address == "/disp-amp") {
			dispPass.amp = m.getArgAsFloat(0);
		
		} else if (address == "/update-shader") {
			brushPass.reload();
			dispPass.reload();
			modelPass.reload();
			
		} else if (address == "/coat") {
			brushPass.opacity = 1.0;
			opacityReset = true;
			
		// model
		} else if (address == "/model-enabled") {
			enableModel = m.getArgAsBool(0);
		
		} else if (address == "/model-index") {
			modelPass.setModelIndex( m.getArgAsInt(0) );
		} else if (address == "/cam-index") {
			modelPass.setCamIndex( m.getArgAsInt(0) );
		} else if (address == "/displacement-amp") {
			modelPass.displacement = m.getArgAsFloat(0);
		} else if (address == "/bg-blink") {
			modelPass.bgIntensity = 1.0;
		}
    }

    // calc audio
    if (audio.gotBeat) {
        beatVolume = 1.0;
        volume = 1.0;
    } else {
        beatVolume = 0.0;
        volume *= 0.93;
    }
    
    if (audio.gotOnset) {
        onsetVolume = 1.0;
    } else {
        onsetVolume *= 0.93;
    }
	
	modelPass.bgIntensity *= 0.95;
	modelPass.volume = audio.volume;
	
	audio.refresh();
	
}

//--------------------------------------------------------------
void ofApp::draw(){
    
    ofBackground(0);
	
    // udpate syphon
    coatTex.draw(0, 0, 1, 1);
//    maskTex.draw(0, 0, 1, 1);
	
    // 1. update brush
	brushPass.update();
	
	// 2. update disp
	dispPass.src = &brushPass.getTexture();
	dispPass.update();

	// 3. rendering
	/*
    renderPass.begin();
	{
		ofScale(scaleWidth, -scaleHeight);
		ofTranslate(0, -CANVAS_HEIGHT);

		dispPass.draw();
	}
    // update render
    renderPass.end();
	 */
	
	if (enableModel) {
		modelPass.src = &dispPass.getTexture();
		modelPass.draw();
	} else {
		ofPushMatrix();
		ofScale((float)ofGetWidth() / CANVAS_WIDTH,
				-(float)ofGetHeight() / CANVAS_HEIGHT);
		ofTranslate(0, -CANVAS_HEIGHT);
		dispPass.draw();
	}
	
	// refresh
	if (opacityReset || --opacityCount < 0) {
		brushPass.opacity = 0.0;
		opacityReset = false;
	}
//	brushPass.opacity = 0.0;
}

//--------------------------------------------------------------
void ofApp::drawGui(ofEventArgs & args){
	gui->draw();
}


//--------------------------------------------------------------
void ofApp::keyPressed(int key){
	
	
	if (key == 's') {
        ofSaveFrame();
	}
}



//--------------------------------------------------------------
void ofApp::windowResized(int w, int h){
}


//--------------------------------------------------------------
void ofApp::keyReleased(int key){}
void ofApp::mouseMoved(int x, int y ){}
void ofApp::mouseDragged(int x, int y, int button){}
void ofApp::mousePressed(int x, int y, int button){}
void ofApp::mouseReleased(int x, int y, int button){}
void ofApp::mouseEntered(int x, int y){}
void ofApp::mouseExited(int x, int y){}
void ofApp::gotMessage(ofMessage msg){}
void ofApp::dragEvent(ofDragInfo dragInfo){}

