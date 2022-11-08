import Web3 from 'web3';
import 'dotenv/config';
// const w3 = new Web3(new Web3.providers.WebsocketProvider(process.env.url));
//wss : event based resp...(listner)
//https : req-> resp
const web3 = new Web3(process.env.url);


export { web3 };
