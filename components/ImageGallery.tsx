// components/ImageGallery.tsx
"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type ImageData = {
  _id: string;
  url: string;
  createdAt: string;
};

export const ImageGallery = ({ fetchImages }: { fetchImages: () => Promise<ImageData[]> }) => {
  const [images, setImages] = useState<ImageData[]>([]);
  

  useEffect(() => {
    const loadImages = async () => {
      const imgs = await fetchImages();
      setImages(imgs);
    };

    loadImages();
  }, [fetchImages]);

  if (images.length === 0) {
    return <p className="text-center text-gray-500 mt-6">No images uploaded yet.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-8">
      {images.map((img) => (
        <div
          key={img._id}
          className="bg-white shadow-md rounded-lg overflow-hidden hover:scale-[1.02] transition-transform"
        >
          <Image
            src={img.url}
            alt="Uploaded"
            width={500}
            height={300}
            className="w-full h-64 object-cover"
          />
          <div className="p-4">
            <p className="text-sm text-gray-500">
              Uploaded: {new Date(img.createdAt).toLocaleString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};