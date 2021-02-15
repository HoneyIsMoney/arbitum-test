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
  const openLabelName = 'open'
  const hatchLabelName = 'hatch'
  const openLabelHash = '0x' + keccak256(openLabelName)

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
  log('Deploying DAOFactory with EVMScripts...')
  const KernelBase = await hre.ethers.getContractFactory("Kernel");
  const kernelBase = await KernelBase.deploy(true); // immediately petrify
  log(`Kernel Base: ${kernelBase.address}`)

  const ACLBase = await hre.ethers.getContractFactory("ACL");
  const aclBase = await ACLBase.deploy();
  log(`acl Base: ${aclBase.address}`)

  const EVMScriptRegistryFactory = await hre.ethers.getContractFactory("EVMScriptRegistryFactory");
  const evmScriptRegistryFactory = await EVMScriptRegistryFactory.deploy();
  log(`EVMScriptRegistryFactory: ${evmScriptRegistryFactory.address}`)

  const DAOFactory = await hre.ethers.getContractFactory("DAOFactory");
  const daoFactory = await DAOFactory.deploy(
    kernelBase.address,
    aclBase.address,
    evmScriptRegistryFactory.address
  );
  log(`daoFactory: ${daoFactory.address}`)

  log('====================')
  log('Deploying APM...')

const hatchLabelHash = '0x' + keccak256(hatchLabelName)
  log(`TLD: ${tldName} (${tldHash})`)
  log(`Label: ${labelName} (${labelHash})`)

  const APMRegistry = await hre.ethers.getContractFactory("APMRegistry");
  const apmRegistryBase = await APMRegistry.deploy();
  log(`apmRegistryBase: ${apmRegistryBase.address}`)

  const APMRepo = await hre.ethers.getContractFactory("Repo");
  const apmRepoBase = await APMRepo.deploy();
  log(`apmRepoBase: ${apmRepoBase.address}`)

  const ENSSubdomainRegistrar = await hre.ethers.getContractFactory("ENSSubdomainRegistrar");
  const ensSubdomainRegistrarBase = await ENSSubdomainRegistrar.deploy();
  log(`ensSubdomainRegistrarBase: ${ensSubdomainRegistrarBase.address}`)

  const APMRegistryFactory = await hre.ethers.getContractFactory("APMRegistryFactory");
  const apmRegistryFactory = await APMRegistryFactory.deploy(
    daoFactory.address,
    apmRegistryBase.address,
    apmRepoBase.address,
    ensSubdomainRegistrarBase.address,
    ENS.address,
    '0x0000000000000000000000000000000000000000' //0x00
  );
  log(`apmRegistryFactory: ${apmRegistryFactory.address}`)





  await tenderly.verify(
    {
      name: "ENSFactory",
      address: ENSFactory.address
    },
    {
      name: "ENS",
      address: ENS.address
    },
    {
      name: "APMRegistry",
      address: apmRegistryBase.address
    },
    {
      name: "Repo",
      address: apmRepoBase.address
    },
    {
      name: "ENSSubdomainRegistrar",
      address: ensSubdomainRegistrarBase.address
    },
    {
      name: "Kernel",
      address: kernelBase.address
    },
    {
      name: "ACL",
      address: aclBase.address
    },
    {
      name: "EVMScriptRegistryFactory",
      address: evmScriptRegistryFactory.address
    },
    {
      name: "DAOFactory",
      address: daoFactory.address
    },
    {
      name: "APMRegistryFactory",
      address: apmRegistryFactory.address
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
