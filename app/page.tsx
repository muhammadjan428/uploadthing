'use client'
import { OurUploadButton } from "@/components/SecondUploadThing";
import { ImmediateImageToast } from "@/components/ImmediateImageToast";
import { ImageUploader } from "@/components/UploadThing";
// import { Toaster } from "react-hot-toast";
import { Toaster } from "sonner";
import { getImagesFromDB } from "@/lib/actions/image.actions";
import { ImageGallery } from "@/components/ImageGallery";


export default function Home() {

  const handleImageUpload = (url: string) => {
    console.log("Uploaded image URL:", url);
    // Save the image URL to your DB or form state
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <h1 className="text-2xl font-bold mb-4">Upload Profile Image</h1>
      {/* <ImageUploader onUpload={handleImageUpload} /> */}
      <ImmediateImageToast onUpload={handleImageUpload} />
      <OurUploadButton />
      {/* <Toaster position="top-right" /> */}
      <Toaster richColors  position="top-center" />
      <ImageGallery fetchImages={getImagesFromDB} />
    </div>
  );
}