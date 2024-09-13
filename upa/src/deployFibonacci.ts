import { Fibonacci__factory } from "../typechain-types";
import * as ethers from "ethers";
import { config } from "@nebrazkp/upa/tool";

const deployUpaFibonacci = async(
  signer: ethers.Signer,
  upaVerifierAddress: string,
  programVkey: string,
  circuitId: string,
) => {
  const fibonacciFactory = new Fibonacci__factory(signer);
  const fibonacci = await fibonacciFactory.deploy(upaVerifierAddress,programVkey, circuitId);
  await fibonacci.waitForDeployment();
  return fibonacci.getAddress();
}

// Main Args
const args = process.argv.slice(2);
const upaVerifierAddress = args[0];
const programVkey = args[1];
const circuitId = args[2];
const keyfile = args[3];
const rpcEndpoint = args[4];

const main = async() => {
  // Load signer
  const provider = new ethers.JsonRpcProvider(rpcEndpoint);
  let wallet = await config.loadWallet(keyfile, "", provider);
  wallet = wallet.connect(provider);
  const fibonacciAddress = await deployUpaFibonacci(wallet, upaVerifierAddress, programVkey, circuitId);
  console.log(fibonacciAddress);
}

main().then(() => {
  process.exit(0);
}).catch((err) => {
  console.error(err);
  process.exit(1);
});
