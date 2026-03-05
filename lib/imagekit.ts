import ImageKit from "@imagekit/nodejs";

const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
const urlEndpoint = process.env.IMAGEKIT_URL_ENDPOINT;

if (!privateKey || !urlEndpoint) {
  console.warn("ImageKit: IMAGEKIT_PRIVATE_KEY or IMAGEKIT_URL_ENDPOINT not set");
}

export const imagekit = new ImageKit({
  privateKey: privateKey ?? "",
  urlEndpoint: urlEndpoint ?? "https://ik.imagekit.io/placeholder",
});

export function getImageKitUrlEndpoint(): string {
  return urlEndpoint ?? "";
}
