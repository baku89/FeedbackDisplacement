#include "ofApp.h"

//--------------------------------------------------------------
void ofApp::setup(){
    
    
    width = 640;
    height = 480;
    
    ofSetWindowShape(width, height);
    brushPass.allocate(width, height);
    
    receiver.setup(PORT);
    
    syphon.setup();
    syphon.set(SYPHON_SERVER, SYPHON_APP);
    
    brushPass.setCoat(syphon.getTexture());
    
    cout << "init syphon tex" << endl;
}

//--------------------------------------------------------------
void ofApp::update(){
    
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
        }
    }
    
    syphon.draw(0, 0, width / 2.0, height / 2.0);
    
    brushPass.update();

}

//--------------------------------------------------------------
void ofApp::draw(){
    
    ofBackground(0);
    
    brushPass.draw();
    
    
    

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

}

//--------------------------------------------------------------
void ofApp::gotMessage(ofMessage msg){

}

//--------------------------------------------------------------
void ofApp::dragEvent(ofDragInfo dragInfo){ 

}
