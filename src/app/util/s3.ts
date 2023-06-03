import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import logger from "./logger";
import { config } from "dotenv";

config()

const client = new S3Client({
  credentials: {
    accessKeyId: process.env.S3_KEY as string,
    secretAccessKey: process.env.S3_PRIVATE_KEY as string,
  },
  region: 'ap-northeast-2',
});

export async function uploadImageToS3(filename: string, buffer: Buffer) {
  const command = new PutObjectCommand({
    Bucket: 'carillon-bucket',
    Key: filename,
    Body: buffer,
    ACL: 'public-read',
  });
  const result = await client.send(command);
  logger.debug(result);
}