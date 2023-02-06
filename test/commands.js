// 代码copy到 truffle console 控制台运行
const instance = await NftMarket.deployed();

instance.mintToken("https://gateway.pinata.cloud/ipfs/Qmb4aom5xNRE5CBRHZsxCsYSdcmX8zfHXgM7ovZxLp3CqL", "500000000000000000", {value: "25000000000000000",from: accounts[0]})
instance.mintToken("https://gateway.pinata.cloud/ipfs/QmcqxBeE2XfagzEBYnaCUfHHTRLMiHi6xap6BDFLoNUfTN", "300000000000000000", {value: "25000000000000000",from: accounts[0]})

instance.getAllNftsOnSale();
instance.tokenURI(1);

instance.ownerOf(1);
instance.ownerOf(2);

instance.balanceOf('0x0E0A311B6b3ae2042ef846E7e712D39821266E4C');