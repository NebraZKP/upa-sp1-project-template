import { utils, sp1 } from "@nebrazkp/upa/sdk";
import * as fs from "fs";
import path from "node:path";

const main = () => {
  console.log("Generating UPA Proof File from SP1 Fibonacci Fixture");

  // Load SP1 Fibonacci Proof Fixture
  const fibonacciFixtureFile = path.join(__dirname, "../..", "fixtures", "sp1FibonacciProofFixture.json");

  const fibonacciFixture = JSON.parse(fs.readFileSync(fibonacciFixtureFile, "ascii"));

  const fixture: sp1.SP1ProofFixture = {
    vkey: fibonacciFixture.vkey,
    proof: fibonacciFixture.proof,
    publicValuesDigest: fibonacciFixture.public_values_digest,
  };

  const appVkProofInputs= sp1.convertSp1ProofFixture(fixture, "v1.2.0");

  // Write UPA Proof VK Inputs to file
  fs.writeFileSync(path.join(__dirname, "../..", "fixtures", "upaProofVkInputs.json"), utils.JSONstringify(appVkProofInputs, 2));
}

main()
