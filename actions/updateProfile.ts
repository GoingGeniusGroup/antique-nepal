"use server";

import { z } from "zod";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { writeFile } from "fs/promises";
import path from "path";

const UpdateProfileSchema = z.object({
  name: z.string().min(2, "Full name must be at least 2 characters"),
  phone: z.string().optional(),
  street: z.string().min(3, "Street must be at least 3 characters"),
  city: z.string().min(2, "City must be at least 2 characters"),
  postal: z.string().min(3, "Postal code must be at least 3 characters"),
  country: z.string().min(2, "Country must be at least 2 characters"),
});

export async function updateProfile(formData: FormData) {
  const session = await auth();

  if (!session?.user?.id) {
    return { success: false, message: "User Not authenticated" };
  }
  const userId = session.user.id;

  const rawData = {
    name: formData.get("name"),
    phone: formData.get("phone"),
    street: formData.get("street"),
    city: formData.get("city"),
    postal: formData.get("postal"),
    country: formData.get("country"),
  };

  const result = UpdateProfileSchema.safeParse(rawData);
  if (!result.success) {
    return { success: false, message: result.error.flatten().fieldErrors };
  }

  const { name, phone, ...addressData } = result.data;
  const avatarFile = formData.get("avatar") as File | null;
  let userImagePath: string | undefined = undefined;

  try {
    // Handle file upload if an avatar is provided
    if (avatarFile && avatarFile.size > 0) {
      const buffer = Buffer.from(await avatarFile.arrayBuffer());
      const filename = `${Date.now()}-${avatarFile.name.replace(/\s+/g, "_")}`;
      const uploadPath = path.join(process.cwd(), "public/userimg", filename);

      await writeFile(uploadPath, buffer);
      userImagePath = `/userimg/${filename}`;
    }

    const userWithAddress = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { addresses: { take: 1 } },
    });

    const addressId = userWithAddress?.addresses[0]?.id;

    await prisma.$transaction(async (tx) => {
      // 1. Update User
      await tx.user.update({
        where: { id: session.user?.id },
        data: {
          name,
          phone,
          image: userImagePath, // Update image path if a new one was uploaded
        },
      });

      // 2. Upsert Address
      if (addressId) {
        await tx.address.update({
          where: { id: addressId },
          data: {
            addressLine1: addressData.street,
            city: addressData.city,
            postalCode: addressData.postal,
            country: addressData.country,
            fullName: name,
            phone: phone || "",
            state: addressData.city, // Assuming city and state are the same for now
          },
        });
      } else {
        await tx.address.create({
          data: {
            userId: userId,
            addressLine1: addressData.street,
            city: addressData.city,
            postalCode: addressData.postal,
            country: addressData.country,
            isDefault: true,
            fullName: name,
            phone: phone || "",
            state: addressData.city, // Assuming city and state are the same for now
          },
        });
      }
    });

    revalidatePath("/(auth)/profile");
    return { success: true, message: "Profile updated successfully" };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "An error occurred while updating the profile.",
    };
  }
}
