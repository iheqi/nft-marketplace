const { ethers } = require("ethers");
const NftMarket = artifacts.require("NftMarket");

contract("NftMarket", accounts => {
  let _contract = null;
  let _nftPrice = ethers.utils.parseEther("0.3").toString();


  before(async () => {
    _contract = await NftMarket.deployed();
    console.log(accounts);
  })

  describe("Mint token", () => {
    const tokenURI = "https://test.com";

    before(async () => {
      await _contract.mintToken(tokenURI, _nftPrice, {
        from: accounts[0]
      })
    })

    it("owner of the first token should be address[0]", async () => {
      const owner = await _contract.ownerOf(1);
      console.log('owner, accounts[0]', owner, accounts[0]);
      assert.equal(owner, accounts[0], "Owner of token is not matching address[0]");
    })

    it("first token should point to the correct tokenURI", async () => {
      const actualTokenURI = await _contract.tokenURI(1);

      assert.equal(actualTokenURI, tokenURI, "tokenURI is not correctly set");
    })

    // tokenURI不能重复
    it("should not be possible to create a NFT with used tokenURI", async () => {
      try {
        await _contract.mintToken(tokenURI, _nftPrice, {
          from: accounts[0]
        })
      } catch (error) {
        assert(error, "NFT was minted with previously used tokenURI");
      }
    })

    it("should have one listed item", async () => {
      const listedItemCount = await _contract.listedItemsCount();
      assert.equal(listedItemCount.toNumber(), 1, "Listed items count is not 1");
    })
  })

})