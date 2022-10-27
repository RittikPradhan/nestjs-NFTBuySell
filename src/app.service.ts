import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import 'dotenv/config';

// import Web3 from 'web3';
// import * as Web3 from 'web3';
import { web3 } from './web3';
import { MongoClient } from 'mongodb';

@Injectable()
export class AppService {
  private readonly Alchemy_Provider: any;
  private ABI: any;
  private Address: any;
  private Web3: any;
  private web3: any;
  private dexContract: any;
  private uri: any;
  private client: any;

  constructor() {
    this.Alchemy_Provider = `${process.env.url}`;
    this.ABI = require('../build/ABI.json');
    this.Address = '0xb34c6cF7ECaB54Cc7Ee32b28171624BDB4b59B1A';
    this.uri =
      'mongodb+srv://0xrittikpradhan:s3ni79lQcElpJS4v@cluster0.fuglox2.mongodb.net/?retryWrites=true&w=majority';
    this.client = new MongoClient(this.uri);
  }

  getHello(): string {
    return 'Hello World!';
  }

  //EventListner(): string {
  // this.dexContract = new web3.eth.Contract(this.ABI, this.Address);
  // console.log(this.dexContract);
  // return "Success";
  // }

  async getSalePurchaseHistory(req: Request): Promise<any> {
    if (req.params.userAddress) {
      var arr = [];

      const address: string = req.params.userAddress;
      const cursor = await this.getDBCursor(address);
      while(await cursor.hasNext()) {
        let eventDetails = await cursor.next();
        console.log(eventDetails);
        arr.push({
                eventName: eventDetails.eventName,
                user: eventDetails.ownerAddress,
                txHash: eventDetails.txHash,
                tokenId: eventDetails.tokenId,
                blockNumber: eventDetails.blockNumber,
                eventTimestamp: eventDetails.eventTimestamp,
              });
      }
      return arr;
    }
  }
  async getDBCursor(address: string): Promise<any> {
    try {
      const cursor = await this.client
        .db('SalePurchase')
        .collection('OwnerHistory')
        .find({ ownerAddress: address });

      return cursor;
    }
    catch (e) {
      console.error(e);
    }
  }
}
