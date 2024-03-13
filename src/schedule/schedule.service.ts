import { MailerService } from "@nestjs-modules/mailer";
import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { EventEmitter2, OnEvent } from "@nestjs/event-emitter";
import { PrismaService } from "src/prisma/prisma.service";

// import { SchedulerRegistry } from "@nestjs/schedule";



@Injectable()
export class ScheduleService{
    //create log terminal
    private readonly logger=new Logger(ScheduleService.name);

    constructor(
        private eventEmitter: EventEmitter2,
        private prismaService: PrismaService,
        private readonly mailService: MailerService,
        private configService: ConfigService
        //quan ly lich trinh
        // private scheduleRegistry: SchedulerRegistry
    ){}
    
    async createSendMail(body: any):Promise<void>{
        this.logger.log('Creating Send Mail with....',body);
        this.eventEmitter.emit('rental.sendMail',body);
    }

    @OnEvent('rental.sendMail')
    async sendRentalMail(body: any){
        // body.email
        await this.mailService.sendMail({
            ...body,
            from: this.configService.get('MAIL_ADMIN'),
            to: 'lamlife113520@gmail.com',
            subject: 'Thông báo thời gian thuê sắp đến hạn!!',
            template: 'rental',
            context: {
                start_date: body.rental.start_date,
                end_date: body.rental.end_date,
            }
        })
        this.logger.log(`Send mail succesed!!`);

        await this.prismaService.rental.update({
            where:{
                id: body.rental.id
            },
            data:{
                status: 'Notified'
            }
        })
    }
}