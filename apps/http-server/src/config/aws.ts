import { S3 } from "aws-sdk";
import { config } from "./config";

const s3 = new S3({
    region: config.AWS_REGION,
    secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
    endpoint: config.AWS_ENDPOINT,
});

export async function getFolder(
    srcPrefix: string,
    dstPrefix: string,
    continuationToken?: string,
) {
    const params = {
        Bucket: config.AWS_BUCKET,
        Prefix: srcPrefix,
        ContinuationToken: continuationToken,
    };

    //: get folder from s3/r2 and list files
    const files = await s3.listObjectsV2(params).promise();

    if(!files.Contents || files.Contents.length === 0) return;

    //TODO: wrong logic
    await Promise.all(files.Contents.map(async (file) => {
        const fileKey = file.Key;
        const fileContent = await s3.getObject({
            Bucket: config.AWS_BUCKET,
            Key: fileKey,
        }).promise();

        const dstKey = fileKey.replace(srcPrefix, dstPrefix);
        await s3.putObject({
            Bucket: config.AWS_BUCKET,
            Key: dstKey,
            Body: fileContent.Body,
        }).promise();
    }));

}