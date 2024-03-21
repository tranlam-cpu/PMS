import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService, 
        private config: ConfigService,
        private jwt: JwtService
    ) { }
    

    async login(dto: AuthDto){
        //find the user for email
        const user=await this.prisma.user.findUnique({
            where:{
                email:dto.email
            }
        })
        //user not fond
        if(!user){
            throw new ForbiddenException('Invalid credentials')
        }

        //compare password
        const pwMatchs=await argon.verify(user.password, dto.password)

        //password not match
        if(!pwMatchs){
            throw new ForbiddenException('Invalid credentials')
        }

        //return token

        return await this.signToken(user.id, user.email)
    }


    async signup(dto: AuthDto){
        try{
            //generate password hash
            const hash=await argon.hash(dto.password)

            const email=await this.prisma.user.findUnique({
                where:{
                    email:dto.email
                }
            });

            if(email){
                throw new ForbiddenException('Email already exists')
            }

            //create user
            const user=await this.prisma.user.create({
                data:{
                    email:dto.email,
                    password:hash
                }
            });

            delete user.password

            return user
        }catch(e){
            if(e instanceof PrismaClientKnownRequestError){
                if(e.code==='P2002'){
                    throw new ForbiddenException('Email already exists')
                }
            }
            throw e
        }
    }



    async signToken(userId:String, email:string):Promise<{exp:Date,email:string,access_token:string}>{
        const payload={
            sub:userId,
            email
        }
        const secret=this.config.get('JWT_SECRET')
        const expires=this.config.get('JWT_EXPIRES')

       
        const token=await this.jwt.signAsync(payload,{
            // expiresIn minutes - ma thong bao het han
            expiresIn: expires,
            secret: secret
        })

         // Calculate the expiration time
        const exp=this.jwt.decode(token).exp;

        return {
            email,
            access_token: token,
            exp
        }
    }
}
