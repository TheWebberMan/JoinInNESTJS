

export class User {
  id: number;
  name: string;
  gender: "MALE" | "FEMALE" | "OTHER";
  age: number;
  email: string;
  profile_standing: "BANNED" | "OKAY";
  created_at: Date;
  password: string;
  reports: number;


}
