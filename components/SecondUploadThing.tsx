"use client";

import { useState } from "react";
import Image from "next/image";
import { toast } from "react-hot-toast";
import { uploadFiles } from "@/utils/uploadthing"; // Utility function
import type { OurFileRouter } from "@/app/api/uploadthing/core";

export const OurUploadButton = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);

    const reader = new FileReader();
    reader.onload = (event) => {
      setPreviewUrl(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);

    const uploadToast = toast.loading("Uploading...");

    try {
      const res = await uploadFiles("imageUploader", {
        files: [selectedFile],
      });

      if (res && res[0]?.url) {
        setUploadedUrl(res[0].url);
        toast.success("Upload Completed!", { id: uploadToast });
      } else {
        toast.error("Upload failed: No URL returned", { id: uploadToast });
      }
    } catch (err: any) {
      toast.error(`Upload failed: ${err.message}`, { id: uploadToast });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <input
        type="file"
        accept="image/*"
        className="border rounded p-2"
        onChange={handleFileChange}
      />

      {previewUrl && (
        <>
          <Image
            src={previewUrl}
            alt="Preview"
            width={300}
            height={300}
            className="rounded-lg object-cover"
          />
          <button
            onClick={handleUpload}
            disabled={isUploading}
            className={`px-4 py-2 rounded text-white ${
              isUploading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600"
            }`}
          >
            {isUploading ? "Uploading..." : "Upload"}
          </button>
        </>
      )}

      {uploadedUrl && (
        <div className="text-green-600 text-center">
          <p>Uploaded successfully!</p>
          <Image
            src={uploadedUrl}
            alt="Uploaded image"
            width={300}
            height={300}
            className="rounded-lg object-cover mt-2"
          />
        </div>
      )}
    </div>
  );
};
