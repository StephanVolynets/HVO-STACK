export const dataURLtoFile = async (dataurl: string, filename: string) => {
  const response = await fetch(dataurl);
  const blob = await response.blob();
  return new File([blob], filename, { type: blob.type });
};
