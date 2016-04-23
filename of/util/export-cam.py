from common import *


dstPath = "/Users/mugi/oF/v0.9.3/apps/2016/SmudgeVJ/bin/data/multicam2.json"

modelNum = 2
camNumList = [4, 3]

modelCam = []

for mi in xrange(modelNum):
	camNum = camNumList[mi]
	camList = []

	for ci in xrange(camNum):
		camList.append(search("cam%d_%d" % (mi, ci)))

	modelCam.append(camList)



# msg = msgpack.packb([
# 	{
# 		"duration": 10,
# 		"pos": [0, 1, 2, 3, 4, 5]
# 	}
# ])

# print msgpack.unpackb(msg)R

def toMatrix(op):

	m = op.GetMg()

	v1 = m.v1
	v2 = m.v2
	v3 = m.v3
	off= m.off

	return [
		v1.x,  v1.y,  v1.z,  0,
		v2.x,  v2.y,  v2.z,  0,
		-v3.x,  -v3.y,  -v3.z,  0,
		off.x, off.y, off.z, 1
	]

def main():
	setFrame(0)

	data = []

	i = 0

	for camList in modelCam:

		modelCamData = {
			"camList": [],
			"count": camNumList[i]
		}

		i += 1

		for cam in camList:

			camData = {
				"duration": 0,
				"matrices": [],
				"fovs": []
			}

			duration = cam[c4d.ID_USERDATA,1].GetFrame(fps)
			camData["duration"] = duration

			for f in xrange(0, duration):
				setFrame(f)
				m = toMatrix(cam)
				fov = math.degrees(cam[c4d.CAMERAOBJECT_FOV_VERTICAL])
				camData["matrices"].append(m)
				camData["fovs"].append(fov)

			modelCamData["camList"].append(camData)

		data.append(modelCamData)


	with open(dstPath, 'w') as f:
		json.dump(data, f)
		print "END"




if __name__=='__main__':
	main()