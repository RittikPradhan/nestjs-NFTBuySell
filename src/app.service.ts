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
    this.uri = 'mongodb+srv://0xrittikpradhan:s3ni79lQcElpJS4v@cluster0.fuglox2.mongodb.net/?retryWrites=true&w=majority';
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

  getSalePurchaseHistory(req: Request): string {
    if(req.params.userAddress) {
      const address: string = req.params.userAddress;
      const data: Array<Object> = this.getAddressHistory(address);
      return "Success " + data.forEach((element) => {console.log(element)});
      // return "" + data;
    }
    return ""; 
  }
  getAddressHistory(address: string): Array<Object> {
    var arr: Array<any>;
    const cursor = this.client.db("SalePurchase").collection("OwnerHistory").find({ ownerAddress: address });
    if(cursor.hasNext()) {
      cursor.forEach(element => {
        arr.push({
          eventName: element.eventName,
          "user ": element.ownerAddress,
          txHash: element.txHash,
          tokenId: element.tokenId,
          blockNumber: element.blockNumber,
          eventTimestamp: element.eventTimestamp,
        });
      });
    }

    //arr
    return [{"ownerAddress " : "0xAbcd", "tokenId " : "1" }, {"ownerAddress " : "0xEfgh",  "tokenId " : "2" }];
  }
}
