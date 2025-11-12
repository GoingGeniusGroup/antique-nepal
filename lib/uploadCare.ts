// @/lib/uploadCare.ts
import { UploadClient } from "@uploadcare/upload-client";

export const uploadcare = new UploadClient({
  publicKey: process.env.NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY!,
});

// Helper to extract UUID from Uploadcare URL
export function extractUploadcareUUID(url: string): string | null {
  try {
    console.log("Extracting UUID from URL:", url);

    // Pattern to match: https://1ktfvxwijd.ucarecd.net/{uuid}/filename.ext
    // OR: https://domain.ucarecdn.net/{uuid}/filename.ext
    // The UUID is the part between slashes after the domain
    const uuidMatch = url.match(/ucare(?:cd|cdn)\.net\/([a-f0-9-]{36})/i);

    const uuid = uuidMatch ? uuidMatch[1] : null;
    console.log("Extracted UUID:", uuid);

    return uuid;
  } catch (error) {
    console.error("Error extracting UUID:", error);
    return null;
  }
}

// Delete file from Uploadcare using REST API
export async function deleteUploadcareFile(fileUrl: string): Promise<boolean> {
  try {
    console.log("Attempting to delete Uploadcare file:", fileUrl);

    const uuid = extractUploadcareUUID(fileUrl);
    if (!uuid) {
      console.warn("Could not extract UUID from Uploadcare URL:", fileUrl);
      return false;
    }

    const publicKey = process.env.NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY;
    const secretKey = process.env.UPLOADCARE_SECRET_KEY;

    console.log("Public Key exists:", !!publicKey);
    console.log("Secret Key exists:", !!secretKey);

    if (!publicKey || !secretKey) {
      console.error("Uploadcare keys not configured");
      return false;
    }

    // Using REST API to delete file
    const response = await fetch(`https://api.uploadcare.com/files/${uuid}/`, {
      method: "DELETE",
      headers: {
        Authorization: `Uploadcare.Simple ${publicKey}:${secretKey}`,
        "Content-Type": "application/json",
      },
    });

    console.log("Delete response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Failed to delete Uploadcare file:", errorText);
      console.error("Response status:", response.status);
      return false;
    }

    const responseData = await response.json();
    console.log("Successfully deleted file from Uploadcare:", responseData);
    return true;
  } catch (error) {
    console.error("Error deleting Uploadcare file:", error);
    return false;
  }
}

// Upload file to Uploadcare
export async function uploadImageToUploadcare(
  file: File
): Promise<string | null> {
  try {
    const formData = new FormData();
    formData.append(
      "UPLOADCARE_PUB_KEY",
      process.env.NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY!
    );
    formData.append("file", file);

    const res = await fetch("https://upload.uploadcare.com/base/", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("Uploadcare upload failed:", err);
      return null;
    }

    const data = await res.json();
    return data.file; // UUID of the uploaded file
  } catch (err) {
    console.error("Uploadcare upload failed:", err);
    return null;
  }
}
