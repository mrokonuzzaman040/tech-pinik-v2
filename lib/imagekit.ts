import ImageKit from "@imagekit/nodejs";

const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
const urlEndpoint = process.env.IMAGEKIT_URL_ENDPOINT;

if (!privateKey) {
  console.warn("ImageKit: IMAGEKIT_PRIVATE_KEY not set");
}

export const imagekit = new ImageKit({
  privateKey: privateKey ?? "",
});

export function getImageKitUrlEndpoint(): string {
  return urlEndpoint ?? "";
}
