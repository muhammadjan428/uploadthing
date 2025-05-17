import mongoose, { Schema, models, model } from "mongoose";

const ImageSchema = new Schema(
  {
    url: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const ImageModel = models.Image || model("Image", ImageSchema);
