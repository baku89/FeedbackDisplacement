import c4d
from c4d import gui, utils
import json
import time, os, math
from c4d.modules import mograph as mo
import gzip

doc = c4d.documents.GetActiveDocument()
fps = doc[c4d.DOCUMENT_FPS]


# json.encoder.FLOAT_REPR = lambda o: format(o, '.6f').rstrip('0').rstrip('.')

def search(name):
    return doc.SearchObject(name)

def escPressed():
    bc = c4d.BaseContainer()
    rs = gui.GetInputState( c4d.BFM_INPUT_KEYBOARD, c4d.KEY_ESC, bc )
    if rs and bc[ c4d.BFM_INPUT_VALUE ]:
        return True
    return False

def setFrame(f):
    doc.SetTime(c4d.BaseTime(f, fps))
    redraw()

def redraw():
    c4d.DrawViews(c4d.DA_ONLY_ACTIVE_VIEW|c4d.DA_NO_THREAD|c4d.DA_NO_REDUCTION|c4d.DA_STATICBREAK)
    c4d.GeSyncMessage(c4d.EVMSG_TIMECHANGED)
    c4d.EventAdd(c4d.EVENT_ANIMATE|c4d.EVENT_FORCEREDRAW)