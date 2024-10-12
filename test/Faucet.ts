import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hre, { ethers } from "hardhat";


describe("Faucet Test", function () {
    //Reusable async method for deployment
    async function deployFaucetFixure() {
      //Contracts are deployed using the first signer/account by default
  
      const [owner, addr1] = await hre.ethers.getSigners();

      const Faucet = await hre.ethers.getContractFactory("Faucet");
      const faucet = await Faucet.deploy();

      const withdrawalAmount = ethers.parseEther("0.2");
      
  
      return { faucet, owner, withdrawalAmount, addr1 };
    }

    describe("deployment", function () {
        it ("Should deploy and set owner correctly", async function () {
            const { faucet, owner } = await loadFixture (deployFaucetFixure);
            expect(await faucet.owner()).to.equal(owner.address);
        });

        it("Should not allow withdrawals above 0.1 ETH at a time", async function() {
            const { faucet, withdrawalAmount, addr1 } = await loadFixture (deployFaucetFixure);

            await expect(faucet.connect(addr1).withdraw(withdrawalAmount)).to.be.revertedWith("Amount exceed limit");
        })

        it("should only allow the owner to perform this action", async function() {
            const { faucet, owner, addr1 } = await loadFixture (deployFaucetFixure);
            
            await expect(faucet.connect(addr1).withdrawAll()).to.be.rejectedWith("Only owner can execute this");
        })
    });
   
});