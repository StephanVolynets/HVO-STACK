import * as common from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";

export class ForbiddenException extends common.ForbiddenException {
  @ApiProperty()
  statusCode!: number;
  @ApiProperty()
  message!: string;
}

export class NotFoundException extends common.NotFoundException {
  @ApiProperty()
  statusCode!: number;
  @ApiProperty()
  message!: string;
}

export class InternalServerErrorException extends common.InternalServerErrorException {
  @ApiProperty()
  statusCode!: number;
  @ApiProperty()
  message!: string;
}

export class BadRequestException extends common.BadRequestException {
  @ApiProperty()
  statusCode!: number;
  @ApiProperty()
  message!: string;
}

export class ConflictException extends common.ConflictException {
  @ApiProperty()
  statusCode!: number;
  @ApiProperty()
  message!: string;
}
