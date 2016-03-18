#include "ofApp.h"

//--------------------------------------------------------------
void ofApp::setup(){

	width = CANVAS_WIDTH;//ofGetWidth();
	height = CANVAS_HEIGHT;//ofGetHeight();
	
	ofSetWindowPosition(1921,0);
//	ofSetFullscreen(true);
	
//    ofSetWindowShape(width, height);
	
    brushPass.allocate(width, height);
    renderPass.allocate(width, height);
	scaleWidth = (float)ofGetWidth() / CANVAS_WIDTH;
	scaleHeight = (float)ofGetHeight() / CANVAS_HEIGHT;
    
    receiver.setup(PORT);
    
    coatTex.setup();
    coatTex.set(SYPHON_COAT, SYPHON_APP);
    maskTex.setup();
    maskTex.set(SYPHON_MASK, SYPHON_APP);
    
    // set
    brushPass.coat = &coatTex.getTexture();
    brushPass.mask = &maskTex.getTexture();
    
    renderPass.src = &brushPass.getTexture();
    renderPass.mask = &maskTex.getTexture();
    
    pickPos.x = 0.5;
    pickPos.y = 0.5;
    
    
    // aubio
    int bufferSize = 256;
    
    beat.setup();
    ofAddListener(beat.gotBeat, this, &ofApp::beatEvent);
    
    onset.setup();
    ofAddListener(onset.gotOnset, this, &ofApp::onsetEvent);
    
	/*
	auto deviceList = soundStream.getDeviceList();
	
	for (auto it = deviceList.begin(); it != deviceList.end(); it++) {
		if (it->name.find(SOUND_DEVIDE_NAME) != string::npos) {
			soundStream.setDevice(*it);
			ofLog(OF_LOG_NOTICE, it->name);
			break;
		}
	}
	*/
	
	soundStream.printDeviceList();
	soundStream.setDeviceID(SOUND_DEVICE_ID);
	
    soundStream.setup(this, 0, 2, 44100, bufferSize, 4);
}

//--------------------------------------------------------------
void ofApp::beatEvent(float &time) {
    gotBeat = true;
}

//--------------------------------------------------------------
void ofApp::onsetEvent(float &time) {
    gotOnset = true;
}

//--------------------------------------------------------------
void ofApp::audioIn(float *input, int bufferSize, int nChannels) {
    beat.audioIn(input, bufferSize, nChannels);
    onset.audioIn(input, bufferSize, nChannels);
    
//    int max = 0;
//    for (int i = 0; i < bufferSize; i++) {
//        if (input[i] > max) {
//            max = input[i];
//        }
//    }
//    
//    volume = max / 256.0;
//    
//    cout << volume << endl;
}

//--------------------------------------------------------------
void ofApp::setupGui(){
	ofSetBackgroundColor(0);
	
	
	gui = new ofxDatGui(ofxDatGuiAnchor::TOP_LEFT);
	gui->setAutoDraw(false);
    
    gui->addFRM();
    
    gui->addSlider("flow type", 0, 10)->bind(brushPass.flowType);
    gui->addSlider("opacity", 0, 1)->bind(brushPass.opacity);
    gui->addSlider("flow speed", 0, 0.1)->bind(brushPass.speed);
    gui->addSlider("offset", 0, 1)->bind(brushPass.offset);
    gui->addSlider("fade", 0, 1)->bind(brushPass.fade);
	guiFillColor = gui->addColorPicker("fill color");
	guiFillColor->setColor(renderPass.fillColor);
    
    gui->addBreak()->setHeight(10.0f);
    gui->addSlider("saturation", 0, 1)->bind(renderPass.saturation);
    gui->addSlider("brightness", 0, 1)->bind(renderPass.brightness);
    
//    gui->addBreak()->setHeight(10.0f);
//    guiPickPos = gui->add2dPad("pick pos");
	
    gui->addBreak()->setHeight(10.0f);
    gui->addSlider("volume", 0, 1)->bind(this->volume);
    gui->addSlider("beat volume", 0, 1)->bind(this->beatVolume);
    gui->addSlider("onset volume", 0, 1)->bind(this->onsetVolume);
    
    gui->addBreak()->setHeight(10.0f);
    guiEnableDisplace = gui->addToggle("enable displace");
}

//--------------------------------------------------------------
void ofApp::update(){
    
    float time = ofGetElapsedTimef();
//    pickPos.set(ofNoise(time), ofNoise(time + 1000.0));
//    guiPickPos->setPoint(pickPos);
	
//    cout << pickPos.x << " " << pickPos.y << endl;
	
    while (receiver.hasWaitingMessages()) {
        ofxOscMessage m;
        receiver.getNextMessage(&m);
        
        string address = m.getAddress();
        
        if (address == "/opacity") {
            brushPass.opacity = m.getArgAsFloat(0);
            
        } else if (address == "/flow-speed") {
            brushPass.speed = m.getArgAsFloat(0);
        
        } else if (address == "/offset") {
            brushPass.offset = m.getArgAsFloat(0);
			
        } else if (address == "/fade") {
            brushPass.fade = m.getArgAsFloat(0);
        
        } else if (address == "/flow-type") {
			brushPass.flowType = m.getArgAsInt(0);
			
        } else if (address == "/saturation") {
            renderPass.saturation = m.getArgAsFloat(0);
            
        } else if (address == "/brightness") {
            renderPass.brightness = m.getArgAsFloat(0);
        
        } else if (address == "/enable-displace") {
            enableDisplace = m.getArgAsBool(0);
            guiEnableDisplace->setEnabled(enableDisplace);
			
		} else if (address == "/fill-color") {
			int color = m.getArgAsRgbaColor(0);
			renderPass.fillColor.setHex(color);
			guiFillColor->setColor(renderPass.fillColor);
			
		
		} else if (address == "/update-shader") {
            brushPass.reload();
            renderPass.reload();
		
        }
    }

    // calc audio
    if (gotBeat) {
        beatVolume = 1.0;
        volume = 1.0;
        gotBeat = false;
    } else {
        beatVolume = 0.0;
        volume *= 0.95;
    }
    
    if (gotOnset) {
        onsetVolume = 1.0;
        gotOnset = false;
    } else {
        onsetVolume = 0.0;
    }
    
    // audio-based parameter
    brushPass.maskOpacity = onsetVolume;
    
    if (enableDisplace) {
        renderPass.displaceIntensity = volume;
    } else {
        renderPass.displaceIntensity = 0.0;
    }
}

//--------------------------------------------------------------
void ofApp::draw(){
    
    ofBackground(0);
    
    // udpate syphon
    coatTex.draw(0, 0, 1, 1);
    maskTex.draw(0, 0, 1, 1);
    
    // update brush
    brushPass.update();

    renderPass.begin();
    
    ofScale(scaleWidth, -scaleHeight);
    ofTranslate(0, -height);
    brushPass.pingPong.dst->draw(0, 0);
    
    // update render
    renderPass.end();
}

//--------------------------------------------------------------
void ofApp::drawGui(ofEventArgs & args){
	
	gui->draw();
	
}


//--------------------------------------------------------------
void ofApp::keyPressed(int key){
	
	if (key == 's') {
        
//        ss.str("");
        
//        ss << "../../../../capture/" << setw(10) << setfill('0') << ofGetFrameNum() << ".png";
		
        ofSaveFrame();
//        ofSaveScreen(ss.str());
		ofLog(OF_LOG_NOTICE, "save frame");
	}

}

//--------------------------------------------------------------
void ofApp::keyReleased(int key){

}

//--------------------------------------------------------------
void ofApp::mouseMoved(int x, int y ){

}

//--------------------------------------------------------------
void ofApp::mouseDragged(int x, int y, int button){

}

//--------------------------------------------------------------
void ofApp::mousePressed(int x, int y, int button){

}

//--------------------------------------------------------------
void ofApp::mouseReleased(int x, int y, int button){

}

//--------------------------------------------------------------
void ofApp::mouseEntered(int x, int y){

}

//--------------------------------------------------------------
void ofApp::mouseExited(int x, int y){

}

//--------------------------------------------------------------
void ofApp::windowResized(int w, int h){
	
	scaleWidth = (float)w / CANVAS_WIDTH;
	scaleHeight = (float)h / CANVAS_HEIGHT;
	
//    width = w;
//    height = h;
	
//    brushPass.setSize(width, height);
//    renderPass.setSize(width, height);

}

//--------------------------------------------------------------
void ofApp::gotMessage(ofMessage msg){

}

//--------------------------------------------------------------
void ofApp::dragEvent(ofDragInfo dragInfo){ 

}
