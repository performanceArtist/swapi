export const getURLId = (url: string) => {
  const matches = url.match(/\/([0-9]+)\/$/);
  if (!matches) return null;
  const rawId = Number(matches[matches.length - 1]);
  if (Number.isNaN(rawId)) {
    console.error(`Invalid id: ${url}`);
    return null;
  }
  return rawId;
};
