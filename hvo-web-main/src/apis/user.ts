import { useAuthContext } from "@/auth/hooks";
import { AssistantDTO, CreateAssistantDTO, UpdateUserDTO, UpdateUserImageDTO, UserProfileDTO } from "hvo-shared";
import { get, post, del } from "@/services/api";

export async function deleteUser(userId: number) {
  try {
    await del(`users/${userId}`);
  } catch (error) {
    console.error(`[deleteUser] ${error}`);
    throw error;
  }
}

export async function getUserProfile(userId: string): Promise<UserProfileDTO> {
  try {
    const response = await get(`users/${userId}/profile`);
    const data = await response.data;

    return data;
  } catch (error) {
    console.error(`[getUserProfile] ${error}`);
    throw error;
  }
}

export async function updateUser(userId: string, dto: UpdateUserDTO) {
  try {
    const response = await post(`users/${userId}/update-profile`, dto);
    const data = response.data;
    return data;
  } catch (err) {
    console.error(`[updateUser] ${err}`);
    throw err;
  }
}

// export async function uploadProfileImage(userId: string, formData: UpdateUserImageDTO) {
//   try {
//     const response = await post(`users/${userId}/profile-image`, formData, {
//       headers: {
//         "Content-Type": "multipart/form-data",
//       },
//     });
//     const data = response.data;
//     return data;
//   } catch (err) {
//     console.error(`[uploadProfileImage] ${err}`);
//     throw err;
//   }
// }

export async function uploadProfileImage(userId: string, file: File) {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await post(`users/${userId}/profile-image`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    const data = response.data as UpdateUserImageDTO; // Type the response
    return data.imageUrl; // Return just the URL since that's what we need in the component
  } catch (err) {
    console.error(`[uploadProfileImage] ${err}`);
    throw err;
  }
}

export async function removeUserImage(userId: string) {
  try {
    const response = await post(`users/${userId}/remove-profile-image`);
    const data = response.data;
    return data;
  } catch (err) {
    console.error(`[removeUserImage] ${err}`);
    throw err;
  }
}

export async function createAssistant(managerId: number, assistantData: CreateAssistantDTO) {
  try {
    const response = await post(`users/${managerId}/create-assistant`, assistantData);
    const data = response.data;
    return data;
  } catch (err) {
    console.error(`[createAssistant] ${err}`);
    throw err;
  }
}

export async function getAssistants({ managerId }: { managerId: number }): Promise<AssistantDTO[]> {
  try {
    const response = await get(`users/${managerId}/assistants`);

    const data = await response.data;

    return data;
  } catch (error) {
    console.error(`[getAssistants] ${error}`);
    throw error;
  }
}
