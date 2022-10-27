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
 
  onModuleInit() {
    this.eventListner();
  }

  async eventListner() {
    this.dexContract = new web3.eth.Contract(this.ABI, this.Address);

    this.dexContract.events.BuyNFT((error: any, event: any) => {
      try {
        this.createNFTListing(event)  
      }
      catch (e) {
        console.error(e);
      }
    })
    .on("connected", (subscriptionId: any) => {
      console.log({ subscriptionId });
    });

    this.dexContract.events.SellNFT((error: any, event: any) => {
      try {
        this.createNFTListing(event)  
      }
      catch (e) {
        console.error(e);
      }
    })
    .on("connected", (subscriptionId: any) => {
      console.log({ subscriptionId });
    });

    this.dexContract.events.TokenMinted((error: any, event: any) => {
      try {
        this.createNFTListing(event)  
      }
      catch (e) {
        console.error(e);
      }
    })
    .on("connected", (subscriptionId: any) => {
      console.log({ subscriptionId });
    });

    this.dexContract.events.TokenBurned((error: any, event: any) => {
      try {
        this.createNFTListing(event)  
      }
      catch (e) {
        console.error(e);
      }
    })
    .on("connected", (subscriptionId: any) => {
      console.log({ subscriptionId });
    });
  }

  async createNFTListing(event: any) {
    this.client.connect();
    const eventDetails = {
      txHash: event.transactionHash,
      blockNumber: event.blockNumber.toString(),
      ownerAddress: event.returnValues.owner,
      tokenId: event.returnValues.tokenId,
      eventName: event.event,
      eventTimestamp: +new Date(), //milliseconds
    }
    const checkDuplicateTxHash = await this.client
    .db("SalePurchase")
    .collection("OwnerHistory")
    .findOne({
      txHash: eventDetails.txHash,
    });

    if (checkDuplicateTxHash === null) {
      const result = await this.client
        .db("SalePurchase")
        .collection("OwnerHistory")
        .insertOne(eventDetails);
      console.log(`New Listing created with following Id: ${result.insertedId}`);
    } else {
      console.log("Hash Already Exists.");
    }
  }

  async createMintBurnListing(event: any) {
    this.client.connect();
    const eventDetails = {
      txHash: event.transactionHash,
      blockNumber: event.blockNumber.toString(),
      ownerAddress: event.returnValues.owner,
      tokenAmount: event.returnValues.tokenAmount,
      ethAmount: event.returnValues.ethAmount,
      eventName: event.event,
      eventTimestamp: +new Date(), //milliseconds
    };
  
    const checkDuplicateTxHash = await this.client
      .db("SalePurchase")
      .collection("MintBurnExchange")
      .findOne({ txHash: eventDetails.txHash });
    if (checkDuplicateTxHash === null) {
      console.log(eventDetails);
      const result = await this.client
        .db("SalePurchase")
        .collection("MintBurnExchange")
        .insertOne(eventDetails);
      console.log(`New Listing created with following Id: ${result.insertedId}`);
    } else {
      console.log("Hash Already Exists.");
    }
  }

  //----------------------------GetAPIs----------------------------

  
  getHello(): string {
    return 'Hello World!';
  }

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

  //----------------------------------------------------------------------

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
