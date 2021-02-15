const hre = require("hardhat");
const { parseLog } = require('ethereum-event-logs');
const { EventFragment } = require("ethers/lib/utils");
const namehash = require('eth-ens-namehash').hash
const keccak256 = require('js-sha3').keccak_256
const logDeploy = require('@aragon/os/scripts/helpers/deploy-logger')

const ensAbi = require('../artifacts/contracts/factory/ENSFactory.sol/ENSFactory.json').abi
const verbose = true

// APM STUFF
const tldName = 'eth'
const labelName = 'aragonpm'
const tldHash = namehash(tldName)
const labelHash = '0x' + keccak256(labelName)
const apmNode = namehash(`${labelName}.${tldName}`)
const openLabelHash = '0x' + keccak256(openLabelName)
const hatchLabelHash = '0x' + keccak256(hatchLabelName)

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

  log('====================')
  log('Deploying APM...')
  log(`TLD: ${tldName} (${tldHash})`)
  log(`Label: ${labelName} (${labelHash})`)



  await tenderly.verify({
      name: "ENSFactory",
      address: ENSFactory.address
    },
    {
      name: "ENS",
      address: ENS.address
    },
  )
  log('====================')



}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
