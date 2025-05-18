"use client";

import { useState, useRef, DragEvent } from "react";
import Image from "next/image";
import { uploadFiles } from "@/utils/uploadthing";
import { toast } from "sonner";
import { saveImageToDB } from "@/lib/actions/image.actions";

type ImageUploaderProps = {
  onUpload: (url: string) => void;
};

export const MultipleUploadthing = ({ onUpload }: ImageUploaderProps) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleFiles = (files: FileList) => {
    const validImages = Array.from(files).filter((file) =>
      file.type.startsWith("image/")
    );

    setSelectedFiles(validImages);

    const previews: string[] = [];
    validImages.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          previews.push(event.target.result as string);
          if (previews.length === validImages.length) {
            setPreviewUrls(previews);
          }
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;
    setIsUploading(true);

    try {
      const res = await uploadFiles("imageUploader", {
        files: selectedFiles,
      });

      const uploadPromises = res.map(async (file) => {
        if (file?.url) {
          const dbRes = await saveImageToDB(file.url);
          if (dbRes.success) {
            onUpload(file.url);
            return file.url;
          } else {
            throw new Error("DB save failed");
          }
        }
      });

      await Promise.all(uploadPromises);

      toast.success("All images uploaded and saved!");
      setSelectedFiles([]);
      setPreviewUrls([]);
    } catch (err: any) {
      toast.error("Upload failed: " + err.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full max-w-md flex flex-col items-center gap-4">
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => inputRef.current?.click()}
        className="w-full min-h-[12rem] border-2 border-dashed border-gray-400 rounded-lg flex flex-wrap gap-2 items-center justify-center text-gray-500 cursor-pointer hover:bg-gray-100 transition p-4"
      >
        {previewUrls.length > 0 ? (
          previewUrls.map((url, index) => (
            <Image
              key={index}
              src={url}
              alt={`Preview ${index}`}
              width={100}
              height={100}
              className="rounded-lg object-cover"
            />
          ))
        ) : (
          <p>Click or drag images here to upload</p>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files) handleFiles(e.target.files);
          }}
        />
      </div>

      {previewUrls.length > 0 && (
        <button
          onClick={handleUpload}
          disabled={isUploading}
          className={`px-4 py-2 rounded text-white ${
            isUploading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600"
          }`}
        >
          {isUploading ? "Uploading..." : "Upload All"}
        </button>
      )}
    </div>
  );
};