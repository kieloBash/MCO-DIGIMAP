"use client";
import React, { useRef, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { saveAs } from "file-saver"; // Import saveAs from file-saver
import { Badge } from "@/components/ui/badge";
import {
  Download,
  Loader2,
  PlusCircle,
  ShipWheelIcon,
  Trash,
} from "lucide-react";

const Home = () => {
  const [selectedFile1, setSelectedFile1] = useState<any>();
  const [selectedFile2, setSelectedFile2] = useState<any>();

  const [image1, setImage1] = useState<File>();
  const [image2, setImage2] = useState<File>();
  const [imageUrl, setImageUrl] = useState<string>("");

  // Refs for file inputs
  const fileInputRef1 = useRef<HTMLInputElement>(null);
  const fileInputRef2 = useRef<HTMLInputElement>(null);

  const [isLoading, setisLoading] = useState(false);

  // Function to trigger file input click
  const handleButtonClick1 = () => {
    fileInputRef1.current?.click();
  };

  const handleButtonClick2 = () => {
    fileInputRef2.current?.click();
  };

  // Function to handle file selection
  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    setImageSrc: React.Dispatch<React.SetStateAction<string | undefined>>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result
          ?.toString()
          .replace("data:", "")
          .replace(/^.+,/, "");
        setImageSrc(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!image1 || !image2) return null;

    const formData = new FormData();
    formData.append("image1", image1);
    formData.append("image2", image2);

    try {
      setisLoading(true);
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

      if (response.data) {
        // Create a URL for the blob
        console.log("File Uploaded Successfully");
        const imageUrl = URL.createObjectURL(response.data);
        // Update the state with the image URL
        setImageUrl(imageUrl);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setisLoading(false);
    }
  };

  const downloadImage = () => {
    if (imageUrl) {
      saveAs(imageUrl, "stitchedImage.png"); // Trigger the download
    }
  };

  const GROUP = [
    "CALVIN CORONADO",
    "MICHELLE MARTINEZ",
    "KIELO MERCADO",
    "Ghrazielle Ramos",
    "VALEN SALIG",
  ];

  return (
    <section className="w-full min-h-screen flex flex-col justify-start items-center gap-8 p-8">
      <article className="flex flex-col justify-center items-center gap-4">
        <h1 className="font-black text-6xl">Image Stitching</h1>
        <p className="w-full max-w-lg text-center">
          Make your dream pics into one whole story! Upload images you want to
          make into a Panoramic Image
        </p>
        <div className="flex gap-2 justify-center items-center">
          {GROUP.map((d, index) => {
            return (
              <Badge
                key={index}
                variant={"outline"}
                className="px-3 text-sm uppercase"
              >
                {d}
              </Badge>
            );
          })}
        </div>
      </article>

      {imageUrl === "" ? (
        <>
          {isLoading ? (
            <div className="w-full flex-1 justify-center items-center flex gap-2">
              <h1 className="text-xl font-semibold">
                Your image is converting into a Panorama pls wait...
              </h1>
              <Loader2 className="animate-spin" />
            </div>
          ) : (
            <article className="flex flex-col justify-center items-center gap-8 mt-10 border rounded-md p-8">
              <div className="w-full flex justify-center items-center gap-8">
                <div className="relative w-72 h-72 overflow-hidden">
                  {/* Display image or show button to upload */}
                  {selectedFile1 ? (
                    <div className="w-full h-full relative overflow-hidden rounded-lg shadow transition-opacity hover:opacity-80 cursor-pointer">
                      <Button
                        variant={"ghost"}
                        className="absolute top-4 right-4 rounded-full w-8 h-8 p-1.5 z-10 bg-transparent"
                        type="button"
                        onClick={() => {
                          setSelectedFile1(undefined);
                          setImage1(undefined);
                        }}
                      >
                        <Trash className="w-full h-full" />
                      </Button>
                      <Image
                        src={`data:image/jpeg;base64,${selectedFile1}`}
                        alt="uploaded"
                        className="w-full h-full"
                        fill
                        onClick={handleButtonClick1}
                      />
                      <input
                        ref={fileInputRef1}
                        className="hidden"
                        type="file"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          setImage1(file);
                          handleFileChange(e, setSelectedFile1);
                        }}
                      />
                    </div>
                  ) : (
                    <>
                      <button
                        onClick={handleButtonClick1}
                        type="button"
                        className="hover:bg-slate-100 transition-colors w-full h-full rounded-lg border-dashed border-2 flex justify-center items-center"
                      >
                        <PlusCircle className="w-6 h-6" />
                      </button>
                      <input
                        ref={fileInputRef1}
                        className="hidden"
                        type="file"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          setImage1(file);
                          handleFileChange(e, setSelectedFile1);
                        }}
                      />
                    </>
                  )}
                </div>
                <div className="">+</div>
                <div className="relative w-72 h-72 overflow-hidden">
                  {/* Display image or show button to upload */}
                  {selectedFile2 ? (
                    <div
                      className="w-full h-full relative overflow-hidden rounded-lg shadow transition-opacity hover:opacity-80 cursor-pointer"
                      onClick={handleButtonClick2}
                    >
                      <Button
                        variant={"ghost"}
                        className="absolute top-4 right-4 rounded-full w-8 h-8 p-1.5 z-10 bg-transparent"
                        type="button"
                        onClick={() => {
                          setSelectedFile2(undefined);
                          setImage2(undefined);
                        }}
                      >
                        <Trash className="w-full h-full" />
                      </Button>
                      <Image
                        src={`data:image/jpeg;base64,${selectedFile2}`}
                        alt="uploaded"
                        className="w-full h-full"
                        fill
                      />
                      <input
                        ref={fileInputRef2}
                        className="hidden"
                        type="file"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          setImage2(file);
                          handleFileChange(e, setSelectedFile2);
                        }}
                      />
                    </div>
                  ) : (
                    <>
                      <button
                        onClick={handleButtonClick2}
                        type="button"
                        className="hover:bg-slate-100 transition-colors w-full h-full rounded-lg border-dashed border-2 flex justify-center items-center"
                      >
                        <PlusCircle className="w-6 h-6" />
                      </button>
                      <input
                        ref={fileInputRef2}
                        className="hidden"
                        type="file"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          setImage2(file);
                          handleFileChange(e, setSelectedFile2);
                        }}
                      />
                    </>
                  )}
                </div>
              </div>
              <div className="">
                <Button onClick={handleUpload} disabled={!image1 || !image2}>
                  Get Stitching <ShipWheelIcon className="w-6 h-6 ml-2" />
                </Button>
              </div>
              {/* <div className="w-80 h-80 relative overflow-hidden border rounded-md">
          <Image src={imageUrl} alt="" fill />
        </div>
        <div className="">
          <Button onClick={downloadImage}>Download Stitched Image</Button>{" "}
        </div> */}
            </article>
          )}
        </>
      ) : (
        <article className="flex justify-center items-start gap-8 w-full">
          <div className="flex flex-col justify-between items-center w-full max-w-xs">
            <div className="flex flex-col w-full max-w-xs">
              <h1 className="text-2xl font-black">
                Here's the result of combining your two images!
              </h1>
              <p className="mt-1">
                We used an image stitching algorithm to combine the two images
                by...
              </p>
              <div className="flex gap-2 mt-4 items-center">
                <div className="w-24 h-24 relative overflow-hidden rounded-xl">
                  <Image
                    src={`data:image/jpeg;base64,${selectedFile1}`}
                    alt="file1"
                    fill
                  />
                </div>
                <div className="">+</div>
                <div className="w-24 h-24 relative overflow-hidden rounded-xl">
                  <Image
                    src={`data:image/jpeg;base64,${selectedFile2}`}
                    alt="file2"
                    fill
                  />
                </div>
              </div>
            </div>
            <Button
              className="w-full mt-10"
              onClick={() => {
                window.location.reload();
              }}
            >
              Stitch Again!
            </Button>
          </div>
          <div className="w-full aspect-square max-w-md rounded-lg relative overflow-hidden border shadow">
            <Image
              src={imageUrl}
              alt="stitched image"
              fill
              objectFit={"contain"}
            />
            <Button
              variant={"outline"}
              className="absolute top-4 right-4 rounded-full w-8 h-8 p-1.5 z-10 bg-transparent"
              type="button"
              onClick={downloadImage}
            >
              <Download className="w-full h-full" />
            </Button>
          </div>
        </article>
      )}
    </section>
  );
};

export default Home;
