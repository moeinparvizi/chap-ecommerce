import { Controller, Get, Put, Body, Param } from '@nestjs/common';
import { ProfileService } from './profile.service';

@Controller('profile')
export class ProfileController {
  constructor(private profileService: ProfileService) {}

  @Get(':id') findOne(@Param('id') id: string) { return this.profileService.findOne(id); }
  @Put(':id') update(@Param('id') id: string, @Body() body: any) { return this.profileService.update(id, body); }
}
