import { opendir } from "fs/promises";
import { join } from "path";

export type FileUpload = {
  filePath: string;
  fileName: string;
  destPath: string;
};

export async function collectFileUploads(
  sourceDirPath: string,
  destPathBase = "/"
): Promise<FileUpload[]> {
  const uploads: FileUpload[] = [];

  const dir = await opendir(sourceDirPath);
  for await (const dirent of dir) {
    if (dirent.isDirectory()) {
      const dirFileUploads = await collectFileUploads(
        join(sourceDirPath, dirent.name),
        join(destPathBase, dirent.name)
      );
      for (const fileUpload of dirFileUploads) {
        uploads.push(fileUpload);
      }
    } else if (dirent.isFile()) {
      uploads.push({
        filePath: join(sourceDirPath, dirent.name),
        fileName: dirent.name,
        destPath: destPathBase,
      });
    }
  }

  return uploads;
}
