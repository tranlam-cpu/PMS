import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand, DeleteObjectsCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuid } from 'uuid';



@Injectable()
export class AwsService {
    private s3: S3Client;
    constructor(private config:ConfigService) {
       this.s3 = new S3Client({
            region: config.get("S3_REGION"),
            credentials: {
                accessKeyId: config.get("S3_ACCESS_KEY"),
                secretAccessKey: config.get("S3_SECRET_KEY"),
            }
                  
       })
        
    }

    async uploadFile(file: Express.Multer.File): Promise<string> {
        const key=`pms/${uuid()}-${file.originalname}`;
        const params = {
            Bucket: this.config.get("S3_STORE_NAME"),
            Body: file.buffer,
            Key: key,
            ContentType: "image/jpeg"
        }
       
        const command=new PutObjectCommand(params);
        
        await this.s3.send(command)
         
        return key
        
    }

    async deleteFile(filename: string): Promise<void> {
        const params ={
            Bucket: this.config.get("S3_STORE_NAME"),
            Key:filename
        }

        const command=new DeleteObjectCommand(params);

        await this.s3.send(command)
    }

    async deleteFiles(filenames: string[]): Promise<void> {
        const params ={
            Bucket: this.config.get("S3_STORE_NAME"),
            Delete:{
                Objects: filenames.map(filename => ({ Key: filename })),
            }
        }

        const command = new DeleteObjectsCommand(params)

        await this.s3.send(command)
    }
}