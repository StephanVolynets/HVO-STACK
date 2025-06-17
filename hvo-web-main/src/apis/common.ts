import { get, post } from "@/services/api";
import { ApproveDubDto } from "hvo-shared";

export async function getAllLanguages() {
  try {
    const response = await get("common/languages");
    const data = await response.data;
    return data;
  } catch (err) {
    console.error(`[getAllLanguages] ${err}`);
    throw err;
  }
}

export async function sendSignInLinkToEmail(email: string) {
  try {
    const response = await post(`users/send-staff-login-link`, {
      email,
    });
    const data = response.data;
    return data;
  } catch (err) {
    console.error(`[sendSignInLinkToEmail] ${err}`);
    throw err;
  }
}

export async function getUploadFolder(folderId: string) {
  try {
    const response = await get(`storage/get-url`, {
      params: {
        folderId,
      },
    });
    const data = response.data;
    return data;
  } catch (err) {
    console.error(`[getUploadFolder] ${err}`);
    throw err;
  }
}
