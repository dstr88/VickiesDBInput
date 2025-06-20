import dotenv from "dotenv";
dotenv.config();

export class Secrets {
  public DATABASE_USER: string;
  public DATABASE_PASSWORD: string;
  public DATABASE_NAME: string;
  public PUBLIC_CONSULT_LINK: string;

  constructor() {
    this.DATABASE_USER = process.env.DATABASE_USER || "";
    this.DATABASE_PASSWORD = process.env.DATABASE_PASSWORD || "";
    this.DATABASE_NAME = process.env.DATABASE_NAME || "";
    this.PUBLIC_CONSULT_LINK = process.env.PUBLIC_CONSULT_LINK || "";
  }
}
