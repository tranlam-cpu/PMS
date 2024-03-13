import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { RentalService } from './rental.service';
import { JwtGuard } from 'src/auth/guard';
import { createRentalDto } from './dto/create-rental.dto';
import { editRentalDto } from './dto/edit-rental.dto';
import { GetUser } from 'src/auth/decorator/get-user.decorator';

@UseGuards(JwtGuard)
@Controller('rental')
export class RentalController {
    constructor(private rentalService:RentalService) {}

    @Get()
    getAllRental(){
        return this.rentalService.getAllRental()
    }

    @Post()
    createRental(
        @Body() dto:createRentalDto,
        @GetUser('email') email: string
    ){
        return this.rentalService.createRental(dto,email)
    }

    @Patch('/:id')
    updateRental(
        @Param('id') id: string,
        @Body() dto:editRentalDto,
        @GetUser('email') email: string
    ){
        return this.rentalService.updateRental(id, dto,email)
    }

    @Delete('/:id')
    deleteRental(
        @Param('id') id: string
    ){
        return this.rentalService.deleteRental(id)
    }
}
