// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@nebrazkp/upa/contracts/IUpaVerifier.sol";

/// @title Fibonacci.

/// @notice This contract implements a simple example of verifying the proof of a computing a
///         fibonacci number. The proof is generated via SP1 and verified using NEBRA UPA.
contract Fibonacci {
    // Address of UPAVerifier contract
    IUpaVerifier public upaVerifier;

    // CircuitId of SP1 Groth16 Verifier
    bytes32 public circuitId;


    /// @notice The verification key for the fibonacci program.
    bytes32 public fibonacciProgramVKey;

    constructor(IUpaVerifier _upaVerifier, bytes32 _fibonacciProgramVKey, bytes32 _circuitId) {
        upaVerifier = _upaVerifier;
        fibonacciProgramVKey = _fibonacciProgramVKey;
        circuitId = _circuitId;
    }

    /// @notice Hashes the public values to a field elements inside Bn254.
    /// Taken directly from SP1's SP1G16Verifier contract.
    /// @param publicValues The public values.
    function hashPublicValues(bytes calldata publicValues) public pure returns (bytes32) {
        return sha256(publicValues) & bytes32(uint256((1 << 253) - 1));
    }

    /// @notice The entrypoint for verifying the proof of a fibonacci number.
    /// @notice Proof is not an argument because it is verified via UPA aggregation.
    /// @notice Fibonacci contract only needs to check that UpaVerifier contract verified proof corresponding to the public values.
    /// @param _publicValues The encoded public values.
    function verifyFibonacci(bytes calldata _publicValues, ProofReference calldata proofReference)
        public
        view
        returns (bool)
    {
        bytes32 publicValuesDigest = hashPublicValues(_publicValues);
        uint256[] memory inputs = new uint256[](2);
        inputs[0] = uint256(fibonacciProgramVKey);
        inputs[1] = uint256(publicValuesDigest);
        bool isProofVerified = upaVerifier.isProofVerified(circuitId, inputs, proofReference);

        return isProofVerified;
    }
}
