// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat")
const { items } = require("../src/items.json")

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

async function main() {
  const [deployer] = await ethers.getSigners()

  const Newage = await hre.ethers.getContractFactory("Newage")
  const newage = await Newage.deploy()
  await newage.deployed()

  console.log(`Deployed Newage Contract at: ${newage.address}\n`)

  //List Items

  for(let i = 0; i < items.length; i++) {
    const transaction = await newage.connect(deployer).list(
      items[i].id,
      items[i].name,
      items[i].category,
      items[i].image,
      tokens(items[i].price),
      items[i].rating,
      ) 

    await transaction.wait()

    console.log(`Listed item ${items[i].id}: ${items[i].name}: ${items[i].image} :${items[i].category}`)
  }

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
 