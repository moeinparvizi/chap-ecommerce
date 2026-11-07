import { Body, Controller, Get, Inject, Param, ParseIntPipe, Post, Put, Req } from '@nestjs/common';
import { CustomPrintService, PrintActor } from './custom-print.service';
import { UploadsService } from './uploads.service';
import {
  CreatePrintRequestDto,
  PrintConfigurationDto,
  ReviewPrintRequestDto,
} from './custom-print.dto';
import { StartUploadDto, UploadPartDto } from './uploads.dto';

type ActorRequest = { user: PrintActor };
@Controller('custom-print')
export class CustomPrintController {
  constructor(
    @Inject(CustomPrintService) private readonly print: CustomPrintService,
    @Inject(UploadsService) private readonly uploads: UploadsService,
  ) {}
  @Get('settings') settings() {
    return this.print.settings();
  }
  @Get('products') products() {
    return this.print.products();
  }
  @Get('configurations') configurations() {
    return this.print.configurations();
  }
  @Post('configurations') configure(@Body() dto: PrintConfigurationDto) {
    return this.print.configure(dto);
  }
  @Post('uploads') start(@Req() req: ActorRequest, @Body() dto: StartUploadDto) {
    return this.uploads.start(req.user.id, dto);
  }
  @Put('uploads/:id/parts/:index') part(
    @Req() req: ActorRequest,
    @Param('id') id: string,
    @Param('index', ParseIntPipe) index: number,
    @Body() dto: UploadPartDto,
  ) {
    return this.uploads.part(req.user.id, id, index, dto.base64);
  }
  @Post('uploads/:id/complete') complete(@Req() req: ActorRequest, @Param('id') id: string) {
    return this.uploads.complete(req.user.id, id);
  }
  @Get('uploads/:id') metadata(@Req() req: ActorRequest, @Param('id') id: string) {
    return this.uploads.metadata(req.user, id);
  }
  @Get('uploads/:id/parts/:index') download(
    @Req() req: ActorRequest,
    @Param('id') id: string,
    @Param('index', ParseIntPipe) index: number,
  ) {
    return this.uploads.downloadPart(req.user, id, index);
  }
  @Post('requests') create(@Req() req: ActorRequest, @Body() dto: CreatePrintRequestDto) {
    return this.print.create(req.user, dto);
  }
  @Get('requests') requests(@Req() req: ActorRequest) {
    return this.print.requests(req.user);
  }
  @Get('requests/:id') detail(@Req() req: ActorRequest, @Param('id') id: string) {
    return this.print.detail(req.user, id);
  }
  @Post('requests/:id/review') review(
    @Req() req: ActorRequest,
    @Param('id') id: string,
    @Body() dto: ReviewPrintRequestDto,
  ) {
    return this.print.review(req.user, id, dto);
  }
  @Post('requests/:id/pay-test') pay(@Req() req: ActorRequest, @Param('id') id: string) {
    return this.print.payTest(req.user, id);
  }
}
