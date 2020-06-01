const People = artifacts.require("People");
const truffleAssert = require("truffle-assertions");

contract("People", async function(accounts){
    let instance;

    before(async function() {
        instance = await People.deployed();
    })

    it("shouldnt create a person with age over 150 years", async function(){
        await truffleAssert.fails(instance.createPerson("Edson", 200, 180, {value: web3.utils.toWei("1", "ether")}), truffleAssert.ErrorType.REVERT);  
    });

    it("shouldn't create without payment", async function() {
        await truffleAssert.fails(instance.createPerson("edson", 134, 180, {value: "1000"}), truffleAssert.ErrorType.REVERT); 
    });

    it("should set senior statues correctly", async function() {
        await instance.createPerson("edson", 65, 190, {value: web3.utils.toWei("1", "ether")});
        let result = await instance.getPerson();
        assert(result.senior === true, "senior level not set");
    });

    it("should set age correctly", async function() {
        let result = await instance.getPerson();
        assert(result.age.toNumber() === 65, "Age not set correctly");
    });

    it("should increase balance when person is created", async function() {
        const initialBalance = await web3.eth.getBalance(instance.address);
        await instance.createPerson("Edd", 37, 129, {value: web3.utils.toWei("1", "ether"), from: accounts[3]});

        assert((parseInt(initialBalance) + 1000000000000000000) === parseInt(await web3.eth.getBalance(instance.address)));
    });

    it("should not allow someone other than owner withdraw money", async function() {
        await truffleAssert.fails(instance.withdrawAll({from: accounts[2]}, truffleAssert.ErrorType.REVERT));
    })

    it("should set balance to 0 when all money is withdrawed", async function() {
        let result = await instance.withdrawAll();
        assert.equal(await web3.eth.getBalance(instance.address), 0);
    });

})