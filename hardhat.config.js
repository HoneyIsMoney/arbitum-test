require("@nomiclabs/hardhat-waffle");
require("@tenderly/hardhat-tenderly");


const secret = require('./keys.json')

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async () => {
  const accounts = await ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.4.24",
  networks: {
    arbitum: {
      url: "https://kovan3.arbitrum.io/rpc",
      accounts: [secret.deployer]
    },
    rinkeby: {
      url: `https://rinkeby.infura.io/v3/b4d9f393413d42a381bd955a310fbb66`,
      accounts: [secret.deployer]
    },
  },
  tenderly: {
    username: "greenhornet",
    project: "arbitum",
  },
};

