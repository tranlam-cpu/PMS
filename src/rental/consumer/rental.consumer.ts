import { Process, Processor } from "@nestjs/bull";
import { Job } from 'bull';
import { ScheduleService } from "src/schedule/schedule.service";

@Processor('rental')
export class RentalConsumer{
  
    constructor(
        private scheduleService: ScheduleService,
    ){}

    @Process("processRental")
    async handleProcessRental(job:Job<unknown>){
        
        this.scheduleService.createSendMail(job.data as any)
   
        
    }
}