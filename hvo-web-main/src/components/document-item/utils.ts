export function getFileNameFromUrl(url) {
  // Decode the URL to handle any encoded characters
  const decodedUrl = decodeURIComponent(url);

  // Split the URL by '/' and get the last segment, which contains the file name and extension
  const parts = decodedUrl.split("/");

  // The last part of the path is the file name with the query parameters
  const lastPart = parts.pop();

  // Split the last part by '?' to remove any query parameters
  const fileName = lastPart?.split("?")[0];

  return fileName;
}
