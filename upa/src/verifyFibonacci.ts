import { Fibonacci__factory } from "../typechain-types";
import * as ethers from "ethers";
import { config } from "@nebrazkp/upa/tool";
import { OffChainSubmission } from "@nebrazkp/upa/sdk";
import * as fs from "fs";

const verifyFibonacci = async(
  signer: ethers.Signer,
  fibonacciAddress: string,
  publicValues: string,
  proofReference: any,
) => {
  const fibonacciContract = Fibonacci__factory.connect(fibonacciAddress, signer);
  return await fibonacciContract.verifyFibonacci(publicValues, proofReference);
}

// Main Args
const args = process.argv.slice(2);
const fibonacciAddress = args[0];
const publicValues = args[1];
const submissionFile = args[2];
const keyfile = args[3];
const rpcEndpoint = args[4];

const main = async() => {
  // Load signer
  const provider = new ethers.JsonRpcProvider(rpcEndpoint);
  let wallet = await config.loadWallet(keyfile, "", provider);
  wallet = wallet.connect(provider);

  const submission: OffChainSubmission = OffChainSubmission.from_json(fs.readFileSync(submissionFile, "ascii"));

  const proofReference = submission.computeProofReference(0);

  const isVerified= await verifyFibonacci(wallet, fibonacciAddress, publicValues, proofReference);
  console.log(isVerified);
}

main().then(() => {
  process.exit(0);
}).catch((err) => {
  console.error(err);
  process.exit(1);
});
