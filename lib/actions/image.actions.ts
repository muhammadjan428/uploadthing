"use server";

import { connectToDB } from "../mongoose";
import { ImageModel } from "../model/image.model";

export const saveImageToDB = async (url: string) => {
  try {
    await connectToDB();

    const newImage = await ImageModel.create({ url });

    // Return a plain object (not the Mongoose model)
    return {
      success: true,
      data: {
        _id: newImage._id.toString(),
        url: newImage.url,
        createdAt: newImage.createdAt,
      },
    };
  } catch (error) {
    console.error("Error saving image:", error);
    return { success: false, error: "Failed to save image to DB." };
  }
};


export const getImagesFromDB = async () => {
  try {
    await connectToDB();

    const images = await ImageModel.find().sort({ createdAt: -1 });

    // Return serializable data
    return images.map((img) => ({
      _id: img._id.toString(),
      url: img.url,
      createdAt: img.createdAt.toISOString(),
    }));
  } catch (error) {
    console.error("Error fetching images:", error);
    return [];
  }
};