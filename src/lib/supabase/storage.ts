const MAX_IMAGE_DIMENSION = 1600;
const WEBP_QUALITY = 0.82;

type ProductImageUploadResult = {
  publicUrl: string;
  originalBytes: number;
  uploadedBytes: number;
  optimized: boolean;
};

const shouldSkipOptimization = (file: File) =>
  file.type === "image/svg+xml" || file.type === "image/gif";

const optimizeProductImage = async (file: File): Promise<File> => {
  if (typeof window === "undefined" || shouldSkipOptimization(file)) {
    return file;
  }

  const imageSource = await createImageBitmap(file);
  const largestSide = Math.max(imageSource.width, imageSource.height);
  const scale = largestSide > MAX_IMAGE_DIMENSION ? MAX_IMAGE_DIMENSION / largestSide : 1;
  const targetWidth = Math.max(1, Math.round(imageSource.width * scale));
  const targetHeight = Math.max(1, Math.round(imageSource.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = targetWidth;
  canvas.height = targetHeight;

  const context = canvas.getContext("2d");
  if (!context) {
    imageSource.close();
    return file;
  }

  context.drawImage(imageSource, 0, 0, targetWidth, targetHeight);
  imageSource.close();

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, "image/webp", WEBP_QUALITY);
  });

  if (!blob || blob.size >= file.size) {
    return file;
  }

  const fileNameWithoutExt = file.name.replace(/\.[^.]+$/, "");
  return new File([blob], `${fileNameWithoutExt}.webp`, { type: "image/webp" });
};

export const uploadProductImage = async (file: File): Promise<ProductImageUploadResult> => {
  const { supabase } = await import("@/lib/supabase/client");
  if (!supabase) {
    throw new Error("Supabase no configurado");
  }

  const optimizedFile = await optimizeProductImage(file);
  const extension = optimizedFile.type === "image/webp" ? "webp" : file.name.split(".").pop() || "jpg";
  const path = `products/${crypto.randomUUID()}.${extension}`;

  const { data, error } = await supabase.storage
    .from("products")
    .upload(path, optimizedFile, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    throw error;
  }

  const { data: publicUrlData } = supabase.storage
    .from("products")
    .getPublicUrl(data.path);

  return {
    publicUrl: publicUrlData.publicUrl,
    originalBytes: file.size,
    uploadedBytes: optimizedFile.size,
    optimized: optimizedFile.size < file.size,
  };
};
