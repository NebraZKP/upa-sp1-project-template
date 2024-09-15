# UPA-SP1 Project Template

This is a template for creating an end-to-end [SP1](https://github.com/succinctlabs/sp1) project
that can generate a proof of any RISC-V program and getting the proof verified in NEBRA UPA.

This repo is a NEBRA maintained fork from [sp1-project-template](https://github.com/succinctlabs/sp1-project-template), the credits of all the SP1 related code belongs to the original author.

## Requirements

- [Rust](https://rustup.rs/)
- [SP1](https://succinctlabs.github.io/sp1/getting-started/install.html)

## Running the Project

There are three main ways to run this project: execute a program, generate a core proof, and
generate an EVM-compatible proof.

### Execute the Program

To run the program without generating a proof:

```sh
cd script
cargo run --release -- --execute
```

This will execute the program and display the output.

### Generate a Core Proof

To generate a core proof for your program:

```sh
cd script
cargo run --release -- --prove
```

### Generate an EVM-Compatible (GROTH16) Proof

> [!WARNING]
> You will need at least 128GB RAM to generate the Groth16 proof.

To generate a PLONK proof that is small enough to be verified on-chain and verifiable by the EVM:

```sh
cd script
cargo run --release --bin evm
```

This command also generates a fixture that can be used to test the verification of SP1 zkVM proofs
inside Solidity. The fixture is in `upa/fixtures` folder.

## UPA Integration

`cd` into the `upa` directory and run the following commands:

```bash
yarn
yarn build
./scripts/upa_sp1
```

Under the hood the `upa_sp1` script:

1. Converts the SP1 Groth16 proof into UPA file format.
2. Deploys UPA Verifier contract to a local hardhat network.
3. Deploys a Fibonacci contract to a local hardhat network. The Fibonacci contract has an entry point
`verifyFibonacci` that checks that the public values of the SP1 proof correspond to a Groth16 proof that
was marked as verified on the UPA Verifier contract. Importantly, note that this function does not do
the actual verification of the Groth16 proof.
4. Submits SP1 Fibonacci Groth16 proof to the UPA Verifier contract.
5. Uses the UPA dev aggregator (a dev tool to mimic actual UPA aggregator) to aggregate the SP1 Groth16 proof
along with another test Groth16 proof. Submits the aggregated proof on-chain.
6. Calls the `verifyFibonacci` function on the Fibonacci contract to check that the SP1 Groth16 proof was
successfully aggregated.

