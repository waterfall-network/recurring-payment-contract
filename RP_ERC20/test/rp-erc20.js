const RP_ERC20 = artifacts.require("RP_ERC20");
const IRP_ERC20 = artifacts.require("IRP_ERC20");

const assert = require("chai").assert;
const truffleAssert = require('truffle-assertions');

const {toWei, BN} = web3.utils;

contract("RP_ERC20", async accounts => {
    const [owner, user1, user2, user3, user4] = accounts;

    let contract = null;
    const contractName = "RP_ERC20";
    const contractSymbol = "RP_ERC20";
    const contractTotalSupply = toWei("1", 'tether');


    beforeEach(async function () {
        if (!contract)
            contract = await RP_ERC20.new(contractName, contractSymbol, contractTotalSupply, owner);
        contract.defaultBlock = "pending";
    })

    it('Check Contract', async function () {
        const symbol = await contract.symbol();
        const name = await contract.name();
        const totalSupply = await contract.totalSupply();

        assert.equal(name, contractName);
        assert.equal(symbol, contractSymbol);
        assert.equal(totalSupply.toString(), contractTotalSupply);
    })

    it('Create Regular Payment', async function () {
        const payment = {
            from: user1,
            to: user2,
            startTime: Math.round(new Date().getTime() / 1000) + 60,
            endTime: Math.round(new Date().getTime() / 1000) + 120,
            interval: IRP_ERC20.RegularPaymentInterval.Day,
            amount: toWei('10'),
            autoProlongation: false,
        }
        const res = await contract.createRegularPayment(payment.from, payment.to, payment.startTime, payment.endTime, payment.interval, payment.amount, payment.autoProlongation, {from: user1});

        const paymentId = await new Promise((resolve) => {
            truffleAssert.eventEmitted(res, 'CreatedRegularPayment', async (ev) => {
                resolve(ev.id)
                return true;
            });
        })

        const paymentResult = await contract.getRegularPayment(paymentId);

        assert.equal(paymentResult.id, paymentId);
        assert.equal(paymentResult.from, payment.from);
        assert.equal(paymentResult.to, payment.to);
        assert.equal(paymentResult.startTime, payment.startTime);
        assert.equal(paymentResult.endTime, payment.endTime);
        assert.equal(paymentResult.interval, payment.interval);
        assert.equal(paymentResult.amount, payment.amount);
        assert.equal(paymentResult.paidAmount, "0");
        assert.equal(paymentResult.isApprovedFrom, true);
        assert.equal(paymentResult.isApprovedTo, false);
        assert.equal(paymentResult.autoProlongation, payment.autoProlongation);

        const wrongPaymentId = "0x3e0c5ebb780b34f05d1e307164ee2a42530eac97dd28584b740155f655d71d25"
        try {
            await contract.getRegularPayment(wrongPaymentId);
        } catch (error) {
            assert.include(
                error.message,
                'Regular payment not found',
                'Regular payment found'
            )
        }


        const myPaymentsResult = await contract.getMyRegularPayments({from: user1});

        assert.equal(myPaymentsResult.length, 1);
        assert.equal(myPaymentsResult[0].id, paymentId);

        const user1PaymentsResult = await contract.getRegularPaymentsByUser(user1);

        assert.equal(user1PaymentsResult.length, 1);
        assert.equal(user1PaymentsResult[0].id, paymentId);


        const notMyPaymentsResult = await contract.getMyRegularPayments({from: user2});
        assert.equal(notMyPaymentsResult.length, 0);

        const user2PaymentsResult = await contract.getRegularPaymentsByUser(user2);
        assert.equal(user2PaymentsResult.length, 0);


    })


    it('Create Regular Payment From Created', async function () {
        const payment = {
            from: user1,
            to: user2,
            startTime: Math.round(new Date().getTime() / 1000) + 60,
            endTime: Math.round(new Date().getTime() / 1000) + 120,
            interval: IRP_ERC20.RegularPaymentInterval.Day,
            amount: toWei('10'),
            autoProlongation: false,
        }
        const res = await contract.createRegularPayment(payment.from, payment.to, payment.startTime, payment.endTime, payment.interval, payment.amount, payment.autoProlongation, {from: user1});

        const paymentId = await new Promise((resolve) => {
            truffleAssert.eventEmitted(res, 'CreatedRegularPayment', async (ev) => {
                resolve(ev.id)
                return true;
            });
        })

        const paymentResult = await contract.getRegularPayment(paymentId);

        assert.equal(paymentResult.id, paymentId);
        assert.equal(paymentResult.from, payment.from);
        assert.equal(paymentResult.to, payment.to);
        assert.equal(paymentResult.startTime, payment.startTime);
        assert.equal(paymentResult.endTime, payment.endTime);
        assert.equal(paymentResult.interval, payment.interval);
        assert.equal(paymentResult.amount, payment.amount);
        assert.equal(paymentResult.paidAmount, "0");
        assert.equal(paymentResult.isApprovedFrom, true);
        assert.equal(paymentResult.isApprovedTo, false);
        assert.equal(paymentResult.autoProlongation, payment.autoProlongation);

    })

    it('Create Regular Payment To Created', async function () {
        const payment = {
            from: user2,
            to: user1,
            startTime: Math.round(new Date().getTime() / 1000) + 60,
            endTime: Math.round(new Date().getTime() / 1000) + 120,
            interval: IRP_ERC20.RegularPaymentInterval.Day,
            amount: toWei('10'),
            autoProlongation: false,
        }
        const res = await contract.createRegularPayment(payment.from, payment.to, payment.startTime, payment.endTime, payment.interval, payment.amount, payment.autoProlongation, {from: user1});

        const paymentId = await new Promise((resolve) => {
            truffleAssert.eventEmitted(res, 'CreatedRegularPayment', async (ev) => {
                resolve(ev.id)
                return true;
            });
        })

        const paymentResult = await contract.getRegularPayment(paymentId);

        assert.equal(paymentResult.id, paymentId);
        assert.equal(paymentResult.from, payment.from);
        assert.equal(paymentResult.to, payment.to);
        assert.equal(paymentResult.startTime, payment.startTime);
        assert.equal(paymentResult.endTime, payment.endTime);
        assert.equal(paymentResult.interval, payment.interval);
        assert.equal(paymentResult.amount, payment.amount);
        assert.equal(paymentResult.paidAmount, "0");
        assert.equal(paymentResult.isApprovedFrom, false);
        assert.equal(paymentResult.isApprovedTo, true);
        assert.equal(paymentResult.autoProlongation, payment.autoProlongation);

    })

    it('Create Regular Payment Other Created', async function () {
        const payment = {
            from: user1,
            to: user2,
            startTime: Math.round(new Date().getTime() / 1000) + 60,
            endTime: Math.round(new Date().getTime() / 1000) + 120,
            interval: IRP_ERC20.RegularPaymentInterval.Day,
            amount: toWei('10'),
            autoProlongation: false,
        }
        const res = await contract.createRegularPayment(payment.from, payment.to, payment.startTime, payment.endTime, payment.interval, payment.amount, payment.autoProlongation, {from: user3});

        const paymentId = await new Promise((resolve) => {
            truffleAssert.eventEmitted(res, 'CreatedRegularPayment', async (ev) => {
                resolve(ev.id)
                return true;
            });
        })

        const paymentResult = await contract.getRegularPayment(paymentId);

        assert.equal(paymentResult.id, paymentId);
        assert.equal(paymentResult.from, payment.from);
        assert.equal(paymentResult.to, payment.to);
        assert.equal(paymentResult.startTime, payment.startTime);
        assert.equal(paymentResult.endTime, payment.endTime);
        assert.equal(paymentResult.interval, payment.interval);
        assert.equal(paymentResult.amount, payment.amount);
        assert.equal(paymentResult.paidAmount, "0");
        assert.equal(paymentResult.isApprovedFrom, false);
        assert.equal(paymentResult.isApprovedTo, false);
        assert.equal(paymentResult.autoProlongation, payment.autoProlongation);

    })

    it('Approve Regular Payment by To', async function () {
        const payment = {
            from: user1,
            to: user2,
            startTime: Math.round(new Date().getTime() / 1000) + 60,
            endTime: Math.round(new Date().getTime() / 1000) + 120,
            interval: IRP_ERC20.RegularPaymentInterval.Day,
            amount: toWei('10'),
            autoProlongation: false,
        }
        const res = await contract.createRegularPayment(payment.from, payment.to, payment.startTime, payment.endTime, payment.interval, payment.amount, payment.autoProlongation, {from: user1});

        const paymentId = await new Promise((resolve) => {
            truffleAssert.eventEmitted(res, 'CreatedRegularPayment', async (ev) => {
                resolve(ev.id)
                return true;
            });
        })

        const paymentResult = await contract.getRegularPayment(paymentId);
        assert.equal(paymentResult.isApprovedTo, false);

        const myPaymentsResult = await contract.getMyRegularPayments({from: user2});

        const hasPayment = myPaymentsResult.findIndex(payment => payment.id === paymentId);

        assert.equal(hasPayment, -1);

        await contract.approveRegularPayment(paymentId, {from: user2});

        const paymentApproveResult = await contract.getRegularPayment(paymentId);
        assert.equal(paymentApproveResult.isApprovedTo, true);

        const myPaymentsResult2 = await contract.getMyRegularPayments({from: user2});
        const hasPayment2 = myPaymentsResult2.findIndex(payment => payment.id === paymentId);

        assert.isAbove(hasPayment2, -1);

    })
    it('Approve Regular Payment by From', async function () {
        const payment = {
            from: user1,
            to: user2,
            startTime: Math.round(new Date().getTime() / 1000) + 60,
            endTime: Math.round(new Date().getTime() / 1000) + 120,
            interval: IRP_ERC20.RegularPaymentInterval.Day,
            amount: toWei('10'),
            autoProlongation: false,
        }
        const res = await contract.createRegularPayment(payment.from, payment.to, payment.startTime, payment.endTime, payment.interval, payment.amount, payment.autoProlongation, {from: user2});

        const paymentId = await new Promise((resolve) => {
            truffleAssert.eventEmitted(res, 'CreatedRegularPayment', async (ev) => {
                resolve(ev.id)
                return true;
            });
        })

        const paymentResult = await contract.getRegularPayment(paymentId);
        assert.equal(paymentResult.isApprovedFrom, false);

        const myPaymentsResult = await contract.getMyRegularPayments({from: user1});

        const hasPayment = myPaymentsResult.findIndex(payment => payment.id === paymentId);

        assert.equal(hasPayment, -1);

        await contract.approveRegularPayment(paymentId, {from: user1});

        const paymentApproveResult = await contract.getRegularPayment(paymentId);
        assert.equal(paymentApproveResult.isApprovedFrom, true);

        const myPaymentsResult2 = await contract.getMyRegularPayments({from: user1});
        const hasPayment2 = myPaymentsResult2.findIndex(payment => payment.id === paymentId);

        assert.isAbove(hasPayment2, -1);

    })

    it('Approve Regular Payment by Other', async function () {
        const payment = {
            from: user1,
            to: user2,
            startTime: Math.round(new Date().getTime() / 1000) + 60,
            endTime: Math.round(new Date().getTime() / 1000) + 120,
            interval: IRP_ERC20.RegularPaymentInterval.Day,
            amount: toWei('10'),
            autoProlongation: false,
        }
        const res = await contract.createRegularPayment(payment.from, payment.to, payment.startTime, payment.endTime, payment.interval, payment.amount, payment.autoProlongation, {from: user3});

        const paymentId = await new Promise((resolve) => {
            truffleAssert.eventEmitted(res, 'CreatedRegularPayment', async (ev) => {
                resolve(ev.id)
                return true;
            });
        })

        const paymentResult = await contract.getRegularPayment(paymentId);
        assert.equal(paymentResult.isApprovedFrom, false);
        assert.equal(paymentResult.isApprovedTo, false);

        const user1PaymentsResult = await contract.getMyRegularPayments({from: user1});
        const hasUser1Payment = user1PaymentsResult.findIndex(payment => payment.id === paymentId);
        assert.equal(hasUser1Payment, -1);

        await contract.approveRegularPayment(paymentId, {from: user1});

        const user1PaymentsResult2 = await contract.getMyRegularPayments({from: user1});
        const hasUser1Payment2 = user1PaymentsResult2.findIndex(payment => payment.id === paymentId);
        assert.isAbove(hasUser1Payment2, -1);


        const user2PaymentsResult = await contract.getMyRegularPayments({from: user2});
        const hasUser2Payment = user2PaymentsResult.findIndex(payment => payment.id === paymentId);
        assert.equal(hasUser2Payment, -1);

        await contract.approveRegularPayment(paymentId, {from: user2});

        const user2PaymentsResult2 = await contract.getMyRegularPayments({from: user2});
        const hasUser2Payment2 = user2PaymentsResult2.findIndex(payment => payment.id === paymentId);
        assert.isAbove(hasUser2Payment2, -1);

        const paymentApproveResult = await contract.getRegularPayment(paymentId);
        assert.equal(paymentApproveResult.isApprovedFrom, true);
        assert.equal(paymentApproveResult.isApprovedTo, true);

    })


    it('Cancel Regular Payment by To', async function () {
        const payment = {
            from: user1,
            to: user2,
            startTime: Math.round(new Date().getTime() / 1000) + 60,
            endTime: Math.round(new Date().getTime() / 1000) + 120,
            interval: IRP_ERC20.RegularPaymentInterval.Day,
            amount: toWei('10'),
            autoProlongation: false,
        }
        const cancelDate = Math.round(new Date().getTime() / 1000) + 90;

        const res = await contract.createRegularPayment(payment.from, payment.to, payment.startTime, payment.endTime, payment.interval, payment.amount, payment.autoProlongation, {from: user1});

        const paymentId = await new Promise((resolve) => {
            truffleAssert.eventEmitted(res, 'CreatedRegularPayment', async (ev) => {
                resolve(ev.id)
                return true;
            });
        })

        await contract.cancelRegularPayment(paymentId, cancelDate, {from: user1});

        const paymentResult = await contract.getRegularPayment(paymentId);

        assert.equal(paymentResult.endTime, cancelDate);

    })

    it('Check BalanceOf with Regular Payments', async function () {
        const payment1 = {
            from: user3,
            to: user4,
            startTime: Math.round(new Date().getTime() / 1000) + 10,
            endTime: Math.round(new Date().getTime() / 1000) + 120,
            interval: IRP_ERC20.RegularPaymentInterval.Minute,
            amount: toWei('5'),
            autoProlongation: false,
        }
        const payment2 = {
            from: user4,
            to: user3,
            startTime: Math.round(new Date().getTime() / 1000) + 10,
            endTime: Math.round(new Date().getTime() / 1000) + 120,
            interval: IRP_ERC20.RegularPaymentInterval.Minute,
            amount: toWei('10'),
            autoProlongation: false,
        }


        const userBalance = toWei('10');
        const resultBalance = (new BN(userBalance)).sub(new BN(payment1.amount)).add(new BN(payment2.amount));
        const result2Balance = (new BN(userBalance)).add(new BN(payment1.amount)).sub(new BN(payment2.amount));


        await contract.transfer(user3, userBalance, {from: owner})

        const userBalanceBefore = await contract.balanceOf(user3);
        assert.equal(userBalance.toString(), userBalanceBefore.toString());

        const res1 = await contract.createRegularPayment(payment1.from, payment1.to, payment1.startTime, payment1.endTime, payment1.interval, payment1.amount, payment1.autoProlongation, {from: user3});
        const paymentId = await new Promise((resolve) => {
            truffleAssert.eventEmitted(res1, 'CreatedRegularPayment', async (ev) => {
                resolve(ev.id)
                return true;
            });
        })
        await contract.approveRegularPayment(paymentId, {from: user4});


        const res2 = await contract.createRegularPayment(payment2.from, payment2.to, payment2.startTime, payment2.endTime, payment2.interval, payment2.amount, payment2.autoProlongation, {from: user3});
        const paymentId2 = await new Promise((resolve) => {
            truffleAssert.eventEmitted(res2, 'CreatedRegularPayment', async (ev) => {
                resolve(ev.id)
                return true;
            });
        })

        await contract.approveRegularPayment(paymentId2, {from: user4});

        const user2BalanceBefore = await contract.balanceOf(user4);

        assert.equal('0', user2BalanceBefore.toString());

        await new Promise(resolve => {
            setTimeout(resolve, 20000)
        })

        await contract.transfer(user4, userBalance, {from: owner})

        const userBalanceAfter = await contract.balanceOf(user3);

        assert.equal(userBalanceAfter.toString(), resultBalance.toString());

        const user2BalanceAfter = await contract.balanceOf(user4);

        assert.equal(user2BalanceAfter.toString(), result2Balance.toString());

    })

    it('Check Regular Payments by user', async function () {
        contract = await RP_ERC20.new(contractName, contractSymbol, contractTotalSupply, owner);
        contract.defaultBlock = "pending";


        const payment1 = {
            from: user3,
            to: user4,
            startTime: Math.round(new Date().getTime() / 1000) + 10,
            endTime: Math.round(new Date().getTime() / 1000) + 120,
            interval: IRP_ERC20.RegularPaymentInterval.Minute,
            amount: toWei('5'),
            autoProlongation: false,
        }
        const payment2 = {
            from: user4,
            to: user3,
            startTime: Math.round(new Date().getTime() / 1000) + 10,
            endTime: Math.round(new Date().getTime() / 1000) + 120,
            interval: IRP_ERC20.RegularPaymentInterval.Minute,
            amount: toWei('10'),
            autoProlongation: false,
        }

        const res1 = await contract.createRegularPayment(payment1.from, payment1.to, payment1.startTime, payment1.endTime, payment1.interval, payment1.amount, payment1.autoProlongation, {from: user3});
        const paymentId = await new Promise((resolve) => {
            truffleAssert.eventEmitted(res1, 'CreatedRegularPayment', async (ev) => {
                resolve(ev.id)
                return true;
            });
        })
        await contract.approveRegularPayment(paymentId, {from: user4});


        const res2 = await contract.createRegularPayment(payment2.from, payment2.to, payment2.startTime, payment2.endTime, payment2.interval, payment2.amount, payment2.autoProlongation, {from: user3});
        const paymentId2 = await new Promise((resolve) => {
            truffleAssert.eventEmitted(res2, 'CreatedRegularPayment', async (ev) => {
                resolve(ev.id)
                return true;
            });
        })

        await contract.approveRegularPayment(paymentId2, {from: user4});

        const user1BalanceBefore = await contract.balanceOf(user3);
        assert.equal(user1BalanceBefore.toString(), '0');

        const user2BalanceBefore = await contract.balanceOf(user4);

        assert.equal(user2BalanceBefore.toString(), '0');

        await new Promise(resolve => {
            setTimeout(resolve, 20000)
        })
        await contract.transfer(owner, "1", {from: owner})

        const user1BalanceAfter = await contract.balanceOf(user3);
        assert.equal(user1BalanceAfter.toString(), '0');

        const user2BalanceAfter = await contract.balanceOf(user4);

        assert.equal(user2BalanceAfter.toString(), '0');

        const user1Payments = await contract.checkRegularPaymentsByUser(user3);
        assert.equal(user1Payments[0].amount.toString(), payment1.amount.toString());

        const user2Payments = await contract.checkRegularPaymentsByUser(user4);
        assert.equal(user2Payments[0].amount.toString(), payment2.amount.toString());

        await contract.transfer(user3, payment1.amount, {from: owner})

        const user1BalanceAfterTransfer = await contract.balanceOf(user3);

        assert.equal(user1BalanceAfterTransfer.toString(), '0');

        const user1PaymentsAfterTransfer = await contract.checkRegularPaymentsByUser(user3);

        assert.equal(user1PaymentsAfterTransfer.length, 0);

        const user2PaymentsAfterTransfer = await contract.checkRegularPaymentsByUser(user4);
        assert.equal(user2PaymentsAfterTransfer.length, 1);

        await contract.transfer(user4, payment2.amount, {from: owner})

        const user2BalanceAfterTransfer = await contract.balanceOf(user4);

        assert.equal(user2BalanceAfterTransfer.toString(), payment1.amount);

        const user2PaymentsAfterTransfer2 = await contract.checkRegularPaymentsByUser(user4);
        assert.equal(user2PaymentsAfterTransfer2.length, 0);



    })


})