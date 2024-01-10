const { expect } = require("chai")

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

    const ID = 1
    const NAME = "dog"
    const CATEGORY = 'Animals'
    const IMAGE = "image 1"
    const COST = 4
    const RATING =5

describe("Newage", () => {
  let newage
  let deployer, buyer
  beforeEach(async () => {
    [deployer, buyer] = await ethers.getSigners()

    const Newage = await ethers.getContractFactory("Newage")
    newage = await Newage.deploy()
  })

  describe("Deployment", () => {
     it('Sets the owner', async () => {
      expect(await newage.owner()).to.equal(deployer.address)
     })
  })
  describe("Listing", () => {
    let transaction

    

    beforeEach(async () => {
      transaction = await newage.connect(deployer).list(
        ID,
        NAME,
        CATEGORY,
        IMAGE,
        COST,
        RATING
      )

      await transaction.wait()
    })
     it('Returns itme attributes', async () => {
      const item = await newage.items(ID)
      expect(item.id).to.equal(ID)
      expect(item.name).to.equal(NAME)
      expect(item.category).to.equal(CATEGORY)
      expect(item.image).to.equal(IMAGE)
      expect(item.cost).to.equal(COST)
      expect(item.rating).to.equal(RATING)
     })

     it("Emits List Event", () => {
      expect(transaction).to.emit(newage, "List")
     })
  })
  describe("Buying", () => {
    let transaction

    beforeEach(async () => {
      transaction= await newage.connect(deployer).list(ID, NAME, CATEGORY, IMAGE, COST, RATING)
      await transaction.wait()

      transaction = await newage.connect(buyer).buy(ID, { value: COST })
    })

    it("Upates buyer's order count", async () => {
      const result = await newage.orderCount(buyer.address)
      expect(result).to.equal(1)
    })

    it("Adds the order", async () => {
      const order = await newage.orders(buyer.address, 1)

      expect(order.time).to.be.greaterThan(0)
      expect(order.item.name).to.equal(NAME)
    })

    it("Updates the contract balance", async () => {
      const result = await ethers.provider.getBalance(newage.address)
      expect(result).to.equal(COST)
    })

    it("Emits Buy Event", () => {
      expect(transaction).to.emit(newage, "Buy")
    })
  })
  describe("Withdrawing", () => {
     beforeEach(async () => {
      let transaction= await newage.connect(deployer).list(ID, NAME, CATEGORY, IMAGE, COST, RATING)
      await transaction.wait()

      transaction = await newage.connect(buyer).buy(ID, { value: COST })
      await transaction.wait()

      balanceBefore = await ethers.provider.getBalance(deployer.address)

      transaction = await newage.connect(deployer).withdraw()
      await transaction.wait()
    })

    it("Updates the owner balance", async () => {
      const balanceAfter = await ethers.provider.getBalance(deployer.address)
      console.log(balanceBefore)
      //expect(balanceAfter).to.be.greaterThan(balanceBefore)
      console.log(balanceAfter)
    })

    it("Updates the contract balance", async () => {
      const result = await ethers.provider.getBalance(newage.address)
      expect(result).to.equal(0)
    })

  })

})
