import numpy as np
import cv2
import glob
from matplotlib import pyplot as plt
import random
import imutils
import os

def initial_alignment(leftImage, warpedImage):
    # Detect SIFT keypoints and descriptors
    sift = cv2.xfeatures2d.SIFT_create()
    kp1, des1 = sift.detectAndCompute(leftImage, None)
    kp2, des2 = sift.detectAndCompute(warpedImage, None)
    
    # Match descriptors using FLANN
    flann = cv2.FlannBasedMatcher(dict(algorithm=0, trees=5), dict(checks=50))
    matches = flann.knnMatch(des1, des2, k=2)
    
    # Filter good matches using Lowe's ratio test
    good_matches = []
    for m, n in matches:
        if m.distance < 0.7 * n.distance:
            good_matches.append(m)
            
    # Draw feature points on images
    leftImage_kp = cv2.drawKeypoints(leftImage, kp1, None, color=(0, 0, 255))
    warpedImage_kp = cv2.drawKeypoints(warpedImage, kp2, None, color=(0, 255, 0))
    
    return leftImage_kp, warpedImage_kp, kp1, kp2, good_matches

def homography_estimation(kp1, kp2, matches, leftImage, warpedImage):
    # Randomly select seed feature points
    seed_matches = random.sample(matches, 4)
    
    # Estimate homography
    src_pts = np.float32([kp1[m.queryIdx].pt for m in seed_matches]).reshape(-1, 1, 2)
    dst_pts = np.float32([kp2[m.trainIdx].pt for m in seed_matches]).reshape(-1, 1, 2)
    M, _ = cv2.findHomography(src_pts, dst_pts, cv2.RANSAC, 5.0)
    
    return M

def alignment_quality_evaluation(leftImage, warpedImage):
    # Compute edge maps
    edge_map1 = cv2.Canny(leftImage, 100, 200)
    edge_map2 = cv2.Canny(warpedImage, 100, 200)
    
    # Calculate difference map
    diff_map = cv2.absdiff(edge_map1, edge_map2)
    
    # Calculate seam cost
    seam_cost = np.sum(diff_map)
    
    return seam_cost

def refinement(leftImage, warpedImage):
    # Content-preserving warping
    # Not implemented for this example
    
    # Down-sampling of input images
    leftImage_downsampled = cv2.resize(leftImage, (0, 0), fx=0.5, fy=0.5)
    warpedImage_downsampled = cv2.resize(warpedImage, (0, 0), fx=0.5, fy=0.5)
    
    # Plausible seam estimation
    # Not implemented for this example
    
    return leftImage_downsampled, warpedImage_downsampled

def stitching(leftImage, warpedImage):
    # Stitch images using OpenCV's stitching module without converting to grayscale
    stitcher = cv2.Stitcher.create()
    status, stitched_img = stitcher.stitch([leftImage, warpedImage])  # No need to convert to grayscale
    
    if status != cv2.Stitcher_OK:
        print("Stitching failed!")
        return None

    return stitched_img

# Example usage:
# files = [open('example1.jpg', 'rb'), open('example1_2.jpg', 'rb')]
# stitched_image = stitch_images(files)
# cv2.imshow("Stitched Image", stitched_image)
# cv2.waitKey(0)
# cv2.destroyAllWindows()
