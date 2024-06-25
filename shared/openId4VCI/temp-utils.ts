//To-Do => Delete this file once draft-13 is adapted in InjiWeb
export const removePathSegmentFromURL = (
  url: string,
  segmentToRemove: string,
) => {
  const urlParts = url.split('/');

  const indexOfSegment = urlParts.indexOf(segmentToRemove);
  if (indexOfSegment === -1) {
    return url;
  }

  urlParts.splice(indexOfSegment, 1);
  return urlParts.join('/');
};

export const removeParamFromURL = (url: string, param: string) => {
  const urlObj = new URL(url);
  urlObj.searchParams.delete(param);
  return urlObj.toString();
};
