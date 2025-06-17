import { get, post } from "@/services/api";

export async function validateStaffJWT(token: string) {
  try {
    const response = await post(`auth/validate-jwt`, {
      token,
    });
    const data = response.data;
    return data;
  } catch (err) {
    console.error(`[validateStaffJWT] ${err}`);
    throw err;
  }
}
