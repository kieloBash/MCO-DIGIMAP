import numpy as np
import cv2
import glob
import imutils
import os

def mix_match(leftImage, warpedImage):
    i1y, i1x = leftImage.shape[:2]
    i2y, i2x = warpedImage.shape[:2]
    for i in range(0, i1x):
        for j in range(0, i1y):
            try:
                if(np.array_equal(leftImage[j,i],np.array([0,0,0])) and  \
                    np.array_equal(warpedImage[j,i],np.array([0,0,0]))):
                    # Take the average of nearby values and average it.
                    warpedImage[j,i] = [0, 0, 0]
                else:
                    if(np.array_equal(warpedImage[j,i],[0,0,0])):
                        warpedImage[j,i] = leftImage[j,i]
                    else:
                        if not np.array_equal(leftImage[j,i], [0,0,0]):
                            bl,gl,rl = leftImage[j,i]
                            warpedImage[j, i] = [bl,gl,rl]
            except:
                pass
    return warpedImage

def stitch_images(files):
    images = []

    for file in files:
        # Read the file content as bytes
        file_bytes = file.read()
        
        # Convert the bytes to a NumPy array
        np_array = np.frombuffer(file_bytes, np.uint8)
        
        # Decode the NumPy array to an OpenCV image
        img = cv2.imdecode(np_array, cv2.IMREAD_COLOR)
        
        images.append(img)
    
    # Perform stitching
    img1 = images[0]
    img2 = images[1]

    # Initiate SIFT detector
    sift = cv2.xfeatures2d.SIFT_create()

    # find the keypoints and descriptors with SIFT
    kp1, des1 = sift.detectAndCompute(img1,None)
    kp2, des2 = sift.detectAndCompute(img2,None)

    FLANN_INDEX_KDTREE = 0
    index_params = dict(algorithm = FLANN_INDEX_KDTREE, trees = 5)
    search_params = dict(checks = 50)

    flann = cv2.FlannBasedMatcher(index_params, search_params)

    matches = flann.knnMatch(des1,des2,k=2)

    # store all the good matches as per Lowe's ratio test.
    good = []
    for m,n in matches:
        if m.distance < 0.7*n.distance:
            good.append(m)

    if len(good) > MIN_MATCH_COUNT:
        src_pts = np.float32([ kp1[m.queryIdx].pt for m in good ]).reshape(-1,1,2)
        dst_pts = np.float32([ kp2[m.trainIdx].pt for m in good ]).reshape(-1,1,2)

        M, mask = cv2.findHomography(src_pts, dst_pts, cv2.RANSAC,5.0)

        h,w = img1.shape
        pts = np.float32([ [0,0],[0,h-1],[w-1,h-1],[w-1,0] ]).reshape(-1,1,2)
        dst = cv2.perspectiveTransform(pts,M)

        img2 = cv2.polylines(img2,[np.int32(dst)],True,255,3, cv2.LINE_AA)

    else:
        print("Not enough matches are found - %d/%d" % (len(good),MIN_MATCH_COUNT))

    height, width = img1.shape
    im2Reg = cv2.warpPerspective(img2, M, (width, height))
    result = cv2.warpPerspective(img2, M, (img2.shape[1] + img1.shape[1], img2.shape[0]))
    result[0:img1.shape[0], img1.shape[1]:img1.shape[1]+img2.shape[1]] = img2

    stitched_img = mix_match(img1, result)

    return stitched_img

# Example usage:
# files = [open('example1.jpg', 'rb'), open('example1_2.jpg', 'rb')]
# stitched_image = stitch_images(files)
# cv2.imshow("Stitched Image", stitched_image)
# cv2.waitKey(0)
# cv2.destroyAllWindows()
