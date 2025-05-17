"use client";

import { useState, useRef, DragEvent } from "react";
import Image from "next/image";
import { uploadFiles } from "@/utils/uploadthing";
import { toast } from "sonner";
import { saveImageToDB } from "@/lib/actions/image.actions";

type ImageUploaderProps = {
  onUpload: (url: string) => void;
};

export const ImmediateImageToast = ({ onUpload }: ImageUploaderProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleFile = (file: File) => {
    setSelectedFile(file);

    const reader = new FileReader();
    reader.onload = (event) => {
      setPreviewUrl(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      handleFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setIsUploading(true);

    try {
      const res = await uploadFiles("imageUploader", {
        files: [selectedFile],
      });

      if (res && res[0]?.url) {
        const url = res[0].url;

        // Save to MongoDB
        const dbRes = await saveImageToDB(url);
        if (dbRes.success) {
          onUpload(url);
          toast.success("Upload completed and saved to database!");
        } else {
          toast.error("Upload succeeded but DB save failed.");
        }
      } else {
        toast.error("Upload failed: No URL returned.");
      }
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
        className="w-full h-48 border-2 border-dashed border-gray-400 rounded-lg flex items-center justify-center text-gray-500 cursor-pointer hover:bg-gray-100 transition"
      >
        {previewUrl ? (
          <Image
            src={previewUrl}
            alt="Preview"
            width={300}
            height={300}
            className="rounded-lg object-cover"
          />
        ) : (
          <p>Click or drag image here to upload</p>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />
      </div>

      {previewUrl && (
        <button
          onClick={handleUpload}
          disabled={isUploading}
          className={`px-4 py-2 rounded text-white ${
            isUploading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600"
          }`}
        >
          {isUploading ? "Uploading..." : "Upload"}
        </button>
      )}
    </div>
  );
};
