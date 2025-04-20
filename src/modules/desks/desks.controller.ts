import {
  Controller,
  UseGuards,
  Get,
  Post,
  Delete,
  Patch,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { DesksService } from './desks.service';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { CreateDeskDto } from './dto/create-desk.dto';
import { UpdateDeskDto } from './dto/update-desk.dto';

@ApiTags('Desks')
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard, RolesGuard)
@Controller('desks')
export class DesksController {
  constructor(private readonly desksService: DesksService) {}

  @Get()
  @ApiOperation({ summary: 'Get all desks' })
  @ApiResponse({ status: 200, description: 'List of desks' })
  getAllDesks() {
    return this.desksService.findAll();
  }

  @Post()
  @Roles('admin')
  @ApiOperation({ summary: 'Create a new desk' })
  @ApiBody({ type: CreateDeskDto })
  @ApiResponse({ status: 201, description: 'Desk created' })
  createDesk(@Body() dto: CreateDeskDto) {
    return this.desksService.create(dto);
  }

  @Patch(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Update a desk by ID' })
  @ApiBody({ type: UpdateDeskDto })
  @ApiResponse({ status: 200, description: 'Desk updated' })
  updateDesk(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateDeskDto,
  ) {
    return this.desksService.update(id, dto);
  }

  @Delete(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Delete a desk by ID' })
  @ApiResponse({ status: 200, description: 'Desk deleted' })
  deleteDesk(@Param('id', ParseIntPipe) id: number) {
    return this.desksService.remove(id);
  }
}
