import Web3 from 'web3';
import 'dotenv/config';
// const w3 = new Web3(new Web3.providers.WebsocketProvider(process.env.url));
const web3 = new Web3(process.env.url);


export { web3 };
