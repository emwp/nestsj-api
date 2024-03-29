import { Repository, EntityRepository } from 'typeorm'
import { User } from './user.entity'
import { AuthCredentialsDto } from './dto/auth-credentials.dto'
import * as bcrypt from 'bcryptjs'

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { username, password } = authCredentialsDto

    const user = new User()
    user.username = username
    user.salt = await bcrypt.genSalt()
    user.password = await this.hashPassword(password, user.salt)
    await user.save()
  }

  async validateUserPassword(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<string> {
    const { username, password } = authCredentialsDto

    const user = await this.findOne({ username })

    if (user && (await user.validatePassword(password))) {
      return user.username
    } else {
      return null
    }
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt)
  }
}
