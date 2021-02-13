import { readFile } from "fs/promises";
import { request, RequestOptions } from "https";
import { join } from "path";
import { FileUpload } from "../collectFileUploads";

export async function uploadFile(fileUpload: FileUpload): Promise<void> {
  const buffer = await readFile(fileUpload.filePath);

  const requestOptions: RequestOptions = {
    hostname: process.env.BUNNY_STORAGE_ZONE_HOST,
    path:
      "/" +
      join(
        process.env.BUNNY_STORAGE_ZONE_NAME as string,
        fileUpload.destPath,
        fileUpload.fileName
      ),
    method: "PUT",
    headers: {
      AccessKey: process.env.BUNNY_STORAGE_ZONE_PASSWORD,
    },
  };

  console.debug("REQUEST OPTIONS", requestOptions);

  return new Promise((resolve, reject) => {
    const req = request(requestOptions, (res) => {
      console.log("RESPONSE STATUS", res.statusCode);

      res.on("data", (data) => {
        process.stdout.write(data);
      });

      res.on("end", () => {
        console.log("RESPONSE END");
        resolve();
      });
    });

    req.write(buffer);

    req.on("error", (err) => {
      reject(err);
    });

    req.end();
  });
}
