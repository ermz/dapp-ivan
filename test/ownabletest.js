const People = artifacts.require("People");
const truffleAssert = require("truffle-assertions");

contract("Ownable", async function(accounts){

    let instance;

    before(async function() {
        instance = await People.deployed();
    })

    it("Should only delete if owner", async function() {

        //create a person with the first account
        await instance.createPerson("edson", 123, 180, {value: web3.utils.toWei("1", "ether"), from: accounts[3]});

        //try to delete first account, with second account. Shouldn't be allowed
        await truffleAssert.fails(instance.deletePerson(accounts[3], {from: accounts[1]}), truffleAssert.ErrorType.REVERT);
    });

    it("Should delete if owner", async function() {
        let instance = await People.new();

        console.log(instance.address);

        await instance.createPerson("edson", 123, 158, {value: web3.utils.toWei("1", "ether"), from: accounts[4]});

        //Delete person created above by using first account which is owner.
        await truffleAssert.passes(instance.deletePerson(accounts[4], {from: accounts[0]}));
    })
})