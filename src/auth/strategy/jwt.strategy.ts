import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt,Strategy } from "passport-jwt";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy,'jwt'){
    constructor(config: ConfigService,private prisma: PrismaService){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: config.get('JWT_SECRET')
         });
    }

    //signin token
    async validate(payload:{sub: string, email: string, iat: number, exp: number}) {
        // {
        // payload: { sub: 1, email: 'lam@gmail.com', iat: 1708879676, exp: 1708880576 }
        // }
        const user=await this.prisma.user.findUnique({
            where:{
                id:payload.sub
            }
        })
        delete user.password
        return user
    }
}