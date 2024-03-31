"use client";
import React, { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { saveAs } from "file-saver"; // Import saveAs from file-saver

const Home = () => {
  const [selectedFile1, setSelectedFile1] = useState<any>();
  const [selectedFile2, setSelectedFile2] = useState<any>();
  const [imageUrl, setImageUrl] = useState<string>("");

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("image1", selectedFile1);
    formData.append("image2", selectedFile2);

    try {
      const response = await axios.post(
        "http://localhost:8080/api/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          responseType: "blob", // Important: Set the response type to blob
        }
      );
      // Create a URL for the blob
      console.log("File Uploaded Successfully");
      const imageUrl = URL.createObjectURL(response.data);
      // Update the state with the image URL
      setImageUrl(imageUrl);
    } catch (error) {
      console.error(error);
    }
  };

  const downloadImage = () => {
    if (imageUrl) {
      saveAs(imageUrl, "stitchedImage.png"); // Trigger the download
    }
  };

  return (
    <section className="w-full h-screen flex flex-col justify-center items-center gap-8">
      <article className="w-full flex justify-center items-center gap-8">
        <div className="flex flex-col gap-2 p-12 border rounded-md shadow-sm">
          <Input
            type="file"
            onChange={(e: any) => {
              setSelectedFile1(e.target.files[0]);
            }}
          />
        </div>
        <div className="flex flex-col gap-2 p-12 border rounded-md shadow-sm">
          <Input
            type="file"
            onChange={(e: any) => {
              setSelectedFile2(e.target.files[0]);
            }}
          />
        </div>
      </article>
      <div className="">
        <Button onClick={handleUpload}>Stitch Images</Button>
      </div>
      <div className="w-80 h-80 relative overflow-hidden border rounded-md">
        <Image src={imageUrl} alt="" fill />
      </div>
      <div className="">
        <Button onClick={downloadImage}>Download Stitched Image</Button>{" "}
      </div>
    </section>
  );
};

export default Home;
