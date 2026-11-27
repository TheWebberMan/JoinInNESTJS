import { IsString, IsNotEmpty, IsLatitude, IsLongitude } from "class-validator";

export class CreateEventDto {
    @IsString()
    @IsNotEmpty()
    title: string;
    @IsString()
    @IsNotEmpty()
    description: string;
    @IsString()
    @IsNotEmpty()
    tag: string;
    @IsString()
    @IsNotEmpty()
    image: string;
    @IsLatitude()
    lat: number;
    @IsLongitude()
    long: number;
    @IsString()
    @IsNotEmpty()
    host: string;
    @IsString()
    @IsNotEmpty()
    date: string;
    @IsString()
    @IsNotEmpty()
    address: string;
}
