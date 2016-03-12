//
//  Interface.h
//  SmudgeVJ
//
//  Created by Baku Hashimoto on 3/12/16.
//
//

#pragma once

#include "ofxOSC.h"


#define PORT 1234

class Interface {
    
    Interface() {
        
        receiver.setup(PORT);
        
    }
    
    update() {
        
//        while (receiver.hasWaitingMessages()) {
//            
//        }
    }
    
    ofxOscReceiver receiver;
    
};
