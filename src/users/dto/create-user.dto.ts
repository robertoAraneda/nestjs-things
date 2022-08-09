import { IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  /**
   * given
   * @example Roberto
   */
  @IsNotEmpty()
  given: string;

  @IsNotEmpty() family: string;

  @IsNotEmpty() password: string;
}
