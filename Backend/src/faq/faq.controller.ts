import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { FaqService } from './faq.service';
import { CreateFaqDto } from './dto/create-faq.dto';
import { AuthGuard } from 'src/users/auth/auth.guard';

@Controller('faq')
export class FaqController {
  constructor(private readonly faqService: FaqService) { }

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createFaqDto: CreateFaqDto) {
    const userId = createFaqDto.userId;
    return this.faqService.create(createFaqDto, userId);
  }

  @UseGuards(AuthGuard)
  @Get()
  allfaq() {
    return this.faqService.allfaq();
  }
}



