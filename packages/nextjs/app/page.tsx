"use client";

import Link from "next/link";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { BugAntIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Address, Balance } from "~~/components/scaffold-eth";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth"
import { InputBase , IntegerInput } from "~~/components/scaffold-eth";
import React, { useState } from 'react';
import { isDeepStrictEqual } from "util";

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();
  const [GRaddress, setGVA] = useState<string>();
  const [Daddress, setDA] = useState<string>();
  const [IName, setIName] = useState<string>();
  const [IDecription, setIDecription] = useState<string>();
  const [IPid, setIPid] = useState<string | bigint>("");
  const { writeContractAsync: writeYourContractAsync } = useScaffoldWriteContract({ contractName: "YourContract" });
  const { data: ownerID } = useScaffoldReadContract({
    contractName: "YourContract",
    functionName: "owner",
  });
  const { data: winingP } = useScaffoldReadContract({
    contractName: "YourContract",
    functionName: "winnerName",
  });
  const { data: winingPid } = useScaffoldReadContract({
    contractName: "YourContract",
    functionName: "winningProposal",
  });

  return (
    <>
      <div className="flex items-center flex-col flex-grow p-4 pt-10">
        <div className="px-5">
          <div className="flex justify-center items-center space-x-2 flex-col sm:flex-row">
            <p className="my-2 font-medium">Connected Address:</p>
            <Address address={connectedAddress} />
          </div>
          <div className="flex justify-center items-center space-x-2 flex-col sm:flex-row">
            <p className="my-2 font-medium">Balance:</p>
            <Balance address={connectedAddress} />
          </div>
          <div className="flex justify-center items-center space-x-2 flex-col sm:flex-row">
            <p className="my-2 font-medium">Contract owner:</p>
            <span>{ownerID}</span>
          </div>
          <div className="flex justify-center items-center space-x-2 flex-col sm:flex-row">
            <p className="my-2 font-medium">Winning Proposial:</p>
            <span>Name: {winingP} ID: {winingPid}</span>
          </div>
          <h1 className="text-2xl font-bold mb-4">Decentralized Voting System</h1>
          <div className="flex justify-center items-center space-x-2 flex-col sm:flex-row">
            <button
              className="btn btn-primary"
              onClick={async () => {
                console.log("AAA address:", GRaddress);
                try {
                  await writeYourContractAsync({
                    functionName: "startVoting",
                  });
                } catch (e) {
                  console.error("Error on start voiting:", e);
                }
              }}
            >
              Start Voiting
            </button>
            <button
              className="btn btn-primary"
              onClick={async () => {
                console.log("AAA address:", GRaddress);
                try {
                  await writeYourContractAsync({
                    functionName: "endVoting",
                  });
                } catch (e) {
                  console.error("Error on start voiting:", e);
                }
              }}
            >
              End Voiting
            </button>
          </div>
          <div className="p-4 max-w-md mx-auto">
            <div className="flex justify-center items-center">
              <label htmlFor="name" className="text-xl font-bold text-center">
                Add Proposal
              </label>
            </div>
            {/* Name Input */}
            <div className="mb-4">
              <label htmlFor="name" className="block font-medium mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter proposial name"
                onChange={e => { setIName(e.currentTarget.value); }}
              />
            </div>

            {/* Description Input */}
            <div className="mb-4">
              <label
                htmlFor="description"
                className="block font-medium mb-2"
              >
                Description
              </label>
              <textarea
                id="description"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="Enter description"
                onChange={e => { setIDecription(e.currentTarget.value); }}
              ></textarea>
            </div>

            {/* Confirm Button */}
            <button
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              type="button"
              onClick={async () => {
                console.log("Add proposial")
                try {
                  await writeYourContractAsync({
                    functionName: "addProposal",
                    args: [IName, IDecription],
                  });
                } catch (e) {
                  console.error("Error on giveRightToVote:", e);
                }
              }}
            >
              Add Proposal
            </button>
          </div>
          <div className="flex justify-center items-center space-x-2 flex-col sm:flex-row mb-4">
            <InputBase name="Give rights to vote" placeholder="address" value={GRaddress} onChange={setGVA} />
            <button
              className="btn btn-primary"
              onClick={async () => {
                console.log("AAA address:", GRaddress);
                try {
                  await writeYourContractAsync({
                    functionName: "giveRightToVote",
                    args: [GRaddress],
                  });
                } catch (e) {
                  console.error("Error on giveRightToVote:", e);
                }
              }}
            >
              Give Right To Vote
            </button>
          </div>

          <div className="flex justify-center items-center space-x-2 flex-col sm:flex-row mb-4">
            <InputBase name="Delegate" placeholder="address" value={Daddress} onChange={setDA} />
            <button
              className="btn btn-primary"
              onClick={async () => {
                console.log("AAA address:", Daddress);
                try {
                  await writeYourContractAsync({
                    functionName: "delegate",
                    args: [Daddress],
                  });
                } catch (e) {
                  console.error("Error on giveRightToVote:", e);
                }
              }}
            >
              Delegate
            </button>
            <button
              className="btn btn-primary"
              onClick={async () => {
                console.log("AAA address:", Daddress);
                try {
                  await writeYourContractAsync({
                    functionName: "revokeDelegation",
                  });
                } catch (e) {
                  console.error("Error on giveRightToVote:", e);
                }
              }}
            >
              Revoke Delegation
            </button>
          </div>
          <div className="flex justify-center items-center space-x-2 flex-col sm:flex-row mb-4">
            <IntegerInput
              value={IPid.toString()}
              onChange={updatedTxValue => {
                setIPid(updatedTxValue);
              }}
              placeholder="uint256"
            />
            <button
              className="btn btn-primary"
              onClick={async () => {
                try {
                  await writeYourContractAsync({
                    functionName: "vote",
                    args: [BigInt(IPid)],
                  });
                } catch (e) {
                  console.error("Error on giveRightToVote:", e);
                }
              }}
            >
              Vote
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
