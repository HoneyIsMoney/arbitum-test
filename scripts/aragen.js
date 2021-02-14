const hre = require("hardhat");
const { parseLog } = require('ethereum-event-logs');
const { EventFragment } = require("ethers/lib/utils");

const ensAbi = require('../artifacts/contracts/factory/ENSFactory.sol/ENSFactory.json').abi
const verbose = true

const log = (...args) => {
  if (verbose) {
    console.log(...args)
  }
}

async function deployEnsFactory() {
  const ENSFactory = await hre.ethers.getContractFactory("ENSFactory");
  const ensFactory = await ENSFactory.deploy();
  await ensFactory.deployed();
  return ensFactory
}

async function deployENS(ENSFactory, signer) {
  const receipt = await ENSFactory.newENS(deployer.address);
  const tx = await receipt.wait(1);
  const ensAddress = parseLog(tx.logs, ensAbi)[0].args.ens;
  const ENS = new hre.ethers.Contract(ensAddress, ensAbi, signer)
  return ENS
}

async function main() {
  const signers = await hre.ethers.getSigners()
  deployer = signers[0]

  log('\n====================')
  log(`deployerAddress: ${deployer.address}`)
  log('====================')

  // deploy ENSFactory
  log('Deploying ENSFactory...')
  const ENSFactory = await deployEnsFactory(deployer)
  log("ensFactory deployed to:", ENSFactory.address);

  // deploy ENS
  log('====================')
  log('Deploying ENS...')
  ENS = await deployENS(ENSFactory, deployer);
  log("ENS deployed to:", ENS.address);


  await tenderly.verify({
    name: "ENSFactory",
    address: ENSFactory.address
  })
  log('====================')



}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
