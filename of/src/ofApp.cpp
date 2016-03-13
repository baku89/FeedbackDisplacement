#include "ofApp.h"

//--------------------------------------------------------------
void ofApp::setup(){

    width = 640;
    height = 480;
    
    ofSetWindowShape(width, height);
    
    brushPass.allocate(width, height);
    renderPass.allocate(width, height);
    
    receiver.setup(PORT);
    
    coatTex.setup();
    coatTex.set(SYPHON_COAT, SYPHON_APP);
    maskTex.setup();
    maskTex.set(SYPHON_MASK, SYPHON_APP);
    
    // set
    brushPass.coat = &coatTex.getTexture();
    brushPass.mask = &maskTex.getTexture();
    
    renderPass.src = &brushPass.getTexture();
    
    pickPos.x = 0.5;
    pickPos.y = 0.5;
    
    
    // aubio
    int bufferSize = 256;
    
    beat.setup();
    ofAddListener(beat.gotBeat, this, &ofApp::beatEvent);
    
    onset.setup();
    ofAddListener(onset.gotOnset, this, &ofApp::onsetEvent);

//    soundStream.printDeviceList();
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
    
    gui->addBreak()->setHeight(10.0f);
    gui->addSlider("saturation", 0, 1)->bind(renderPass.saturation);
    gui->addSlider("brightness", 0, 1)->bind(renderPass.brightness);
    
    gui->addBreak()->setHeight(10.0f);
    guiPickPos = gui->add2dPad("pick pos");
    
    gui->addBreak()->setHeight(10.0f);
    gui->addSlider("beat volume", 0, 1)->bind(this->beatVolume);
    gui->addSlider("onset volume", 0, 1)->bind(this->onsetVolume);
}

//--------------------------------------------------------------
void ofApp::update(){
    
    float time = ofGetElapsedTimef();
    pickPos.set(ofNoise(time), ofNoise(time + 1000.0));
    guiPickPos->setPoint(pickPos);
    
    cout << pickPos.x << " " << pickPos.y << endl;
    
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
			
		} else if (address == "/flow-type") {
			brushPass.flowType = m.getArgAsInt(0);
			
        } else if (address == "/saturation") {
            renderPass.saturation = m.getArgAsFloat(0);
            
        } else if (address == "/brightness") {
            renderPass.brightness = m.getArgAsFloat(0);
            
		}else if (address == "/update-shader") {
            brushPass.reload();
            renderPass.reload();
		}
    }

    
    if (gotBeat) {
        beatVolume = 1.0;
        gotBeat = false;
//        brushPass.offset = ofRandomuf();
    } else {
        beatVolume = 0.0;
    }
    
    if (gotOnset) {
        onsetVolume = 1.0;
        gotOnset = false;
    } else {
        onsetVolume = 0.0;
    }
    brushPass.maskOpacity = onsetVolume;
    
    
}

//--------------------------------------------------------------
void ofApp::draw(){
    
    ofBackground(0);
    
    // udpate syphon
    coatTex.draw(0, 0, 1, 1);
    maskTex.draw(0, 0, 1, 1);
    
    // update brush
    brushPass.update();
    
    ofScale(1, -1);
    ofTranslate(0, -height);
    brushPass.pingPong.dst->draw(0, 0);
    
    // update render
//    renderPass.update();
    
    
//    renderPass.draw();
}

//--------------------------------------------------------------
void ofApp::drawGui(ofEventArgs & args){
	
	gui->draw();
	
}


//--------------------------------------------------------------
void ofApp::keyPressed(int key){

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
    
    width = w;
    height = h;
    
    brushPass.setSize(width, height);
    renderPass.setSize(width, height);

}

//--------------------------------------------------------------
void ofApp::gotMessage(ofMessage msg){

}

//--------------------------------------------------------------
void ofApp::dragEvent(ofDragInfo dragInfo){ 

}
