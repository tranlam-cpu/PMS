import { Module } from '@nestjs/common';
import { RentalController } from './rental.controller';
import { RentalService } from './rental.service';
import { BullModule } from '@nestjs/bull';
import { RentalConsumer } from './consumer';
import { ScheduleService } from 'src/schedule/schedule.service';


@Module({
  imports: [
    BullModule.registerQueue({
      name: 'rental',
    }),
  ],
  controllers: [RentalController],
  providers: [RentalConsumer,RentalService,ScheduleService]
})
export class RentalModule {}
