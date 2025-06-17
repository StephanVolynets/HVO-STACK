import { get, post } from "@/services/api";
import { AxiosRequestConfig } from "axios";
import { CreateCreatorDTO, CreatorAddLanguageDTO } from "hvo-shared";

export async function findCreatorSummaries(page: number, limit: number) {
  try {
    const response = await get(`creators/summaries`, {
      params: { page, limit },
    });
    const data = await response.data;

    return data;
  } catch (error) {
    console.error(`[findCreatorSummaries] ${error}`);
    // throw error;
  }
}

export async function countCreators() {
  try {
    const response = await get(`creators/count`);
    const data = await response.data;

    return data;
  } catch (error) {
    console.error(`[countCreators] ${error}`);
    // throw error;
  }
}

export async function createCreator(creatorData: CreateCreatorDTO) {
  try {
    const response = await post(`users/creator`, creatorData);
    const data = response.data;
    return data;
  } catch (err) {
    console.error("[createCreator] Error:", {
      userMessage: err.response?.data?.message,
      status: err.response?.status,
      technicalMessage: err.message,
    });
    throw err;
  }
}

export async function getAllCreatorsBasic() {
  try {
    const response = await get(`creators/all-basic`);
    const data = await response.data;

    return data;
  } catch (error) {
    console.error(`[getAllCreatorsBasic] ${error}`);
    // throw error;
  }
}

export async function getCreatorStats(creatorId: number) {
  try {
    const response = await get(`creators/stats/${creatorId}`);
    const data = await response.data;

    return data;
  } catch (error) {
    console.error(`[getCreatorStats] ${error}`);
    // throw error;
  }
}

export async function getCreatorLanguages(creatorId: number) {
  try {
    const response = await get(`creators/${creatorId}/languages`);
    const data = await response.data;

    return data;
  } catch (error) {
    console.error(`[getCreatorLanguages] ${error}`);
    // throw error;
  }
}

export async function addLanguageToCreator(creatorAddLanguageDTO: CreatorAddLanguageDTO) {
  try {
    const response = await post(`creators/add-language`, creatorAddLanguageDTO);
    const data = response.data;
    return data;
  } catch (err) {
    console.error(`[addLanguageToCreator] ${err}`);
    throw err;
  }
}

export async function getManagerName(userId: number) {
  try {
    const response = await get(`creators/assistant/${userId}/manager-name`);
    const data = await response.data;
    return data;
  } catch (error) {
    console.error(`[getManagerName] ${error}`);
  }
}