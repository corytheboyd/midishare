import { collectFileUploads } from "../collectFileUploads";
import { uploadFile } from "./uploadFile";

export async function uploadDirectory(dirPath: string): Promise<void> {
  const fileUploads = await collectFileUploads(dirPath);
  await Promise.all(fileUploads.map((fu) => uploadFile(fu)));
}
