import { IsString, IsNotEmpty, IsLatitude, IsLongitude } from "class-validator";

export class CreateEventDto {
    @IsString()
    @IsNotEmpty()
    titel: string;
    @IsString()
    @IsNotEmpty()
    beskrivelse: string;
    @IsString()
    @IsNotEmpty()
    tag: string;
    @IsString()
    @IsNotEmpty()
    billede: string;
    @IsLatitude()
    lat: number;
    @IsLongitude()
    long: number;
    @IsString()
    @IsNotEmpty()
    host: string;
    @IsString()
    @IsNotEmpty()
    dato: string;
    @IsString()
    @IsNotEmpty()
    adresse: string;
}
