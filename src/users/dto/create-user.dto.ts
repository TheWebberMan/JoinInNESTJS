import { IsBoolean , IsNumber, IsNotEmpty, IsString, IsInt, IsEnum, Min, IsDate } from "class-validator"

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsEnum(["MALE", "FEMALE","OTHER"], {
        message: "Valid gender required"
    })
  gender: "MALE" | "FEMALE" | "OTHER";
  @IsInt()
  age: number;
  email: string;
  @IsString()
  password: string;

}