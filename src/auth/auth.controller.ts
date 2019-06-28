import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  InternalServerErrorException,
} from '@nestjs/common'
import { AuthCredentialsDto } from './dto/auth-credentials.dto'
import { AuthService } from './auth.service'
import { ConflictException } from '@nestjs/common'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  async signUp(
    @Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto,
  ): Promise<void> {
    try {
      await this.authService.signUp(authCredentialsDto)
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Username already exists.')
      } else {
        throw new InternalServerErrorException()
      }
    }
  }

  @Post('/signin')
  signIn(@Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto) {
    return this.authService.signIn(authCredentialsDto)
  }
}
