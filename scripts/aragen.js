const hre = require("hardhat");

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

async function main() {
  const signers = await hre.ethers.getSigners()
  const provider = hre.ethers.provider
  const deployerAddress = signers[0].address
  log('\n====================')
  log(`deployerAddress: ${deployerAddress}`)
  log('====================')

  // deploy ENSFactory
  log('Deploying ENSFactory...')
  const ENSFactory = await deployEnsFactory(deployerAddress)
  log("ensFactory deployed to:", ENSFactory.address);

  // deploy ENS
  log('====================')
  log('Deploying ENS...')
  let ensAdd
  const receipt = await ENSFactory.newENS(deployerAddress).then(await ENSFactory.on('DeployENS(address)', (ev) =>{
    ensAdd = ev
    log(`event: ${ev}`)
  }))
  log(ensAdd)
/*
  ENSFactory.on({
    address: ENSFactory.address,
    topics: [ethers.utils.id("newENS(address)")]
  }, result => log(result))
*/
  await receipt.wait(1)
  console.log(ensAdd)

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


/*
const ethers = require('.');

let provider = ethers.getDefaultProvider();

let contractEnsName = 'registrar.firefly.eth';

let topic = ethers.utils.id("nameRegistered(bytes32,address,uint256)");

let filter = {
  address: contractEnsName,
  topics: [ topic ]
}

provider.on(filter, (result) => {
  console.log(result);
});

// Force starting events from this block; for this example
provider.resetEventsBlock(6448261);
*/