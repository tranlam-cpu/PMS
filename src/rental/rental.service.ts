import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { createRentalDto } from './dto/create-rental.dto';
import { editRentalDto } from './dto/edit-rental.dto';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { Job } from 'bull';

@Injectable()
export class RentalService {
    private jobs: { [key: string]: Job }; 
    constructor(
        @InjectQueue('rental') private rentalQueue: Queue,
        private prismaService: PrismaService,   
        ) {
            this.jobs = {};
        }

    async getAllRental(){
        return this.prismaService.rental.findMany()
    }

    async createRental(dto: createRentalDto,email: string){
        const startDate = new Date(dto.start_date);
        const endDate = new Date(dto.end_date);
        const durationInMilliseconds = endDate.getTime() - startDate.getTime();
        //  // Convert duration to seconds
        // const durationInSeconds = durationInMilliseconds / 1000;
        //  // Convert duration to minutes
        // const durationInMinutes = durationInSeconds / 60;

        // // Convert duration to hours
        // const durationInHours = durationInMinutes / 60;

        // // Convert duration to days
        // const durationInDays = durationInHours / 24;
        

        if(durationInMilliseconds<=(24*60*60*1000)){
            const rental= this.prismaService.rental.create({
                data: {
                    status: "Inactive",
                    rental_duration: durationInMilliseconds,
                    ...dto as any,      
                },
                include: {
                    products: true,
                }
            })


            return rental
        }else{
            const rental= this.prismaService.rental.create({
                data: {
                    status: "Active",
                    rental_duration: durationInMilliseconds,
                    ...dto as any,      
                },
                include: {
                    products: true,
                }
            })

            await this.rentalQueue.add('processRental', {rental:await rental,email}, { delay: durationInMilliseconds,jobId: `${(await rental).id}`, });
            
            return rental
        }

        

        
        
    }

    async updateRental(id: string, dto: editRentalDto,email:string){
        if(dto.start_date && dto.end_date){
            //remove old job from queue
            const jobToRemove = await this.rentalQueue.getJob(id);
            await jobToRemove?.remove();
            //create new job
            const startDate = new Date(dto.start_date);
            const endDate = new Date(dto.end_date);
            const durationInMilliseconds = endDate.getTime() - startDate.getTime();

            const rental= this.prismaService.rental.update({
                where: { id },
                data: {
                    status: "Active",
                    rental_duration: durationInMilliseconds,
                    ...dto as any,
                }
            });

            if(durationInMilliseconds<=(24*60*60*1000)){
                const rental= this.prismaService.rental.update({
                    where: { id },
                    data:{
                        status: "Inactive",
                        rental_duration: durationInMilliseconds,
                        ...dto as any,
                    },
                });
    
                return rental
            }
    
            await this.rentalQueue.add('processRental', {rental:await rental,email}, { delay: durationInMilliseconds,jobId: `${(await rental).id}`, });
                
            return rental
        }else{
            const rental= this.prismaService.rental.update({
                where: { id },
                data: {
                    status: "Active",
                    ...dto as any,
                }
            });
    
            //remove old job from queue
            const jobToRemove = await this.rentalQueue.getJob(id);
            await jobToRemove?.remove();
    
            //create new job
            const startDate = new Date((await rental).start_date);
            const endDate = new Date((await rental).end_date);
            const durationInMilliseconds = endDate.getTime() - startDate.getTime();
    
            if(durationInMilliseconds<=(24*60*60*1000)){
                const rental= this.prismaService.rental.update({
                    where: { id },
                    data:{
                        status: "Inactive",
                        rental_duration: durationInMilliseconds,
                        ...dto as any,
                    },
                });
    
                return rental
            }
    
            await this.rentalQueue.add('processRental', {rental:await rental,email}, { delay: durationInMilliseconds,jobId: `${(await rental).id}`, });
                
            return rental
        }
        
        

    }

    async deleteRental(id: string){
        const jobToRemove = await this.rentalQueue.getJob(id);

        await jobToRemove?.remove();

        return this.prismaService.rental.delete({
            where: { id },
        });
    }
}
