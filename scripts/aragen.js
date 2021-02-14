const hre = require("hardhat");

async function deployEnsFactory() {
  const ENSFactory = await hre.ethers.getContractFactory("ENSFactory");
  const ensFactory = await ENSFactory.deploy();
  await ensFactory.deployed();
  return ensFactory
}

async function main() {
  const signers = await hre.ethers.getSigners()
  const deployerAddress = signers[0].address
  console.log(`\ndeployerAddress: ${deployerAddress}`)
  console.log('----------------------------------------------------------------------')

  // deploy ENSFactory
  const ENSFactory = await deployEnsFactory(deployerAddress)
  console.log("ensFactory deployed to:", ENSFactory.address);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
