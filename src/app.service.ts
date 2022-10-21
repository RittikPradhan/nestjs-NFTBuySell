import { Injectable } from '@nestjs/common';
// import * as dotenv from 'dotenv';
import 'dotenv/config';
import * as Web3 from 'web3';

@Injectable()
export class AppService {

  private readonly Alchemy_Provider: any;
  private ABI: any;
  private Address: any;
  // private web3: Web3;

  constructor() {
    this.Alchemy_Provider = `${process.env.url}`;
    this.ABI = require('../build/ABI.json');
    this.Address = "0xDfB98072A198c86209436733A7d7AEaF4e4bBa53";

  }
  getHello(): string {
    return 'Hello World!';
  }

  getSalePurchaseHistory(): string {

    return this.Alchemy_Provider;
  }
}
