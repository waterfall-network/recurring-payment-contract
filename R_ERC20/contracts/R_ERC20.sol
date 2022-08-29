// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/Context.sol";

contract R_ERC20 is Context, ERC20 {

    enum RegularPaymentInterval {Second, Minute, Hour, Day, Week, Month, Year}

    struct RegularPayment {
        bytes32 id;
        address from; // who pays
        address to; // who get tokens
        uint startTime; // date and time of the beginning of the calculation of regular payments
        uint endTime; // date and time of the end of the calculation of regular payments
        RegularPaymentInterval interval; // 1 a day, 1 a week, 1 a month, 1 a year
        uint256 amount; // amount per interval
        uint256 paidAmount; // how many tokens were spent. needed to calculate the balance of the holder.
        bool isApprovedFrom; // Second user should approve regular payment
        bool isApprovedTo; // Second user should approve regular payment
        bool autoProlongation; // ignores endTime and the regular payment stops after calling the cancelRegularPayment function
        address creator; // who created Regular Payment.
    }

    mapping(bytes32 => RegularPayment) private _regularPayments;
    mapping(address => bytes32[]) private _regularUserPayments;

    event CreatedRegularPayment(bytes32 id, address creator, address from, address to, uint startTime, uint endTime, RegularPaymentInterval interval, uint256 amount, bool autoProlongation);
    event ApprovedRegularPayment(bytes32 id, address user);
    event CanceledRegularPayment(bytes32 id, uint endTime, address user);


    modifier isExistRegularPayment(bytes32 id) {
        require(_regularPayments[id].amount > 0, "R_ERC20: Regular payment not found");
        _;
    }
    modifier isMyRegularPayment(bytes32 id) {
        require(_msgSender() == _regularPayments[id].from || _msgSender() == _regularPayments[id].to, "R_ERC20: Regular payment isn't for you");
        _;
    }
    modifier isActiveRegularPayment(bytes32 id) {
        require(_regularPayments[id].endTime > block.timestamp, "R_ERC20: Regular payment isn't active");
        _;
    }

    constructor(
        string memory name,
        string memory symbol,
        uint256 initialSupply,
        address owner
    ) ERC20(name, symbol) {
        _mint(owner, initialSupply);
    }


    function createRegularPayment(address from, address to, uint startTime, uint endTime, RegularPaymentInterval interval, uint256 amount, bool autoProlongation) public virtual returns (bytes32 id){
        address creator = _msgSender();

        require(from != address(0), "R_ERC20: from address is zero");
        require(to != address(0), "R_ERC20: to address is zero");
        require(startTime < endTime, "R_ERC20: start time is later than end time");
        require(startTime > block.timestamp, "R_ERC20: current date is later than start time");
        require(endTime > block.timestamp, "R_ERC20: current date is later than end time");
        require(amount > 0, "R_ERC20: amount is zero");


        bytes32 _id = sha256(abi.encodePacked(creator, from, to, startTime, endTime, interval, amount, autoProlongation));

        RegularPayment memory newRegularPayment = RegularPayment({
        id : _id,
        from : from,
        to : to,
        startTime : startTime,
        endTime : endTime,
        interval : interval,
        amount : amount,
        paidAmount : 0,
        isApprovedFrom : creator == from,
        isApprovedTo : creator == to,
        autoProlongation : autoProlongation,
        creator : creator
        });

        _regularPayments[_id] = newRegularPayment;

        if (creator == from) {
            _regularUserPayments[creator].push(_id);
        } else if (creator == to) {
            _regularUserPayments[creator].push(_id);
        }

        emit CreatedRegularPayment(_id, creator, from, to, startTime, endTime, interval, amount, autoProlongation);
        return _id;
    }

    function getRegularPayment(bytes32 id) isExistRegularPayment(id) external view returns (RegularPayment memory) {
        return _regularPayments[id];
    }

    function approveRegularPayment(bytes32 id) isExistRegularPayment(id) isActiveRegularPayment(id) isMyRegularPayment(id) public virtual returns (bool success){
        RegularPayment storage _payment = _regularPayments[id];

        if (_msgSender() == _payment.from) {
            require(_msgSender() == _payment.from && _payment.isApprovedFrom == false, "R_ERC20: Regular payment was approved by you1");
            _payment.isApprovedFrom = true;
        } else if (_msgSender() == _payment.to) {
            require(_msgSender() == _payment.to && _payment.isApprovedTo == false, "R_ERC20: Regular payment was approved by you2");
            _payment.isApprovedTo = true;
        }

        _regularUserPayments[_msgSender()].push(id);

        emit ApprovedRegularPayment(id, _msgSender());
        return true;
    }

    function cancelRegularPayment(bytes32 id, uint endTime) isExistRegularPayment(id) isActiveRegularPayment(id) isMyRegularPayment(id) public virtual returns (bool success){
        RegularPayment storage _payment = _regularPayments[id];

        uint _endTime = block.timestamp;
        if (endTime > 0)
            _endTime = endTime;

        _payment.endTime = _endTime;
        emit CanceledRegularPayment(id, _endTime, _msgSender());
        return true;
    }


    function getMyRegularPayments() external view returns (RegularPayment[] memory) {
        return _getRegularPaymentsByUser(_msgSender());
    }

    function getRegularPaymentsByUser(address user) external view returns (RegularPayment[] memory) {
        require(user != address(0), "R_ERC20: user address is zero");
        return _getRegularPaymentsByUser(user);
    }

    function getMyActiveRegularPayments() external view returns (RegularPayment[] memory) {
        return _getActiveRegularPaymentsByUser(_msgSender());
    }

    function getActiveRegularPaymentsByUser(address user) external view returns (RegularPayment[] memory) {
        require(user != address(0), "R_ERC20: user address is zero");
        return _getActiveRegularPaymentsByUser(user);
    }


    function _getRegularPaymentsByUser(address user) internal view returns (RegularPayment[] memory) {
        bytes32[] storage paymentsIds = _regularUserPayments[user];
        RegularPayment[] memory userRegularPayments = new RegularPayment[](paymentsIds.length);

        for (uint i = 0; i < paymentsIds.length; ++i) {
            userRegularPayments[i] = _regularPayments[paymentsIds[i]];
        }
        return userRegularPayments;
    }

    function _isActiveRegularPayment(RegularPayment memory regularPayment) internal view returns (bool) {
        if (regularPayment.endTime < block.timestamp)
            return false;
        if (regularPayment.startTime > block.timestamp)
            return false;
        if (!regularPayment.isApprovedTo)
            return false;
        if (!regularPayment.isApprovedFrom)
            return false;
        return true;
    }

    function _getRegularPaymentAmount(RegularPayment memory regularPayment) internal view returns (uint256) {
        uint256 amount = 0;

        uint spendTime = block.timestamp - regularPayment.startTime;

        if (regularPayment.interval == RegularPaymentInterval.Second) {
            amount = ((spendTime / 1 seconds) + 1) * regularPayment.amount;
        } else if (regularPayment.interval == RegularPaymentInterval.Minute) {
            amount = ((spendTime / 1 minutes) + 1) * regularPayment.amount;
        } else if (regularPayment.interval == RegularPaymentInterval.Hour) {
            amount = ((spendTime / 1 hours) + 1) * regularPayment.amount;
        } else if (regularPayment.interval == RegularPaymentInterval.Day) {
            amount = ((spendTime / 1 days) + 1) * regularPayment.amount;
        } else if (regularPayment.interval == RegularPaymentInterval.Week) {
            amount = ((spendTime / 1 weeks) + 1) * regularPayment.amount;
        } else if (regularPayment.interval == RegularPaymentInterval.Month) {
            amount = ((spendTime / 30 days) + 1) * regularPayment.amount;
        } else if (regularPayment.interval == RegularPaymentInterval.Year) {
            amount = ((spendTime / 356 days) + 1) * regularPayment.amount;
        }
        if (regularPayment.paidAmount > 0 && amount > regularPayment.paidAmount) {
            amount -= regularPayment.paidAmount;
        }

        return amount;
    }

    function _getActiveRegularPaymentsByUser(address user) internal view returns (RegularPayment[] memory) {
        bytes32[] storage paymentsIds = _regularUserPayments[user];

        uint length = 0;
        for (uint i = 0; i < paymentsIds.length; ++i) {
            if (_isActiveRegularPayment(_regularPayments[paymentsIds[i]])) {
                length++;
            }
        }
        RegularPayment[] memory userActiveRegularPayments = new RegularPayment[](length);

        uint j = 0;
        for (uint i = 0; i < paymentsIds.length; ++i) {
            if (_isActiveRegularPayment(_regularPayments[paymentsIds[i]])) {
                userActiveRegularPayments[j] = _regularPayments[paymentsIds[i]];
                j++;
            }
        }

        return userActiveRegularPayments;
    }


    function getRegularPaymentAmount(bytes32 id) isExistRegularPayment(id) external view returns (uint256) {
        if (_isActiveRegularPayment(_regularPayments[id])) {
            return _getRegularPaymentAmount(_regularPayments[id]);
        }
        return 0;
    }

    function _calcBalance(uint256 balance, uint256 profitAmount, uint256 debtsAmount) internal pure returns (uint256){
        return balance + profitAmount < debtsAmount ? 0 : balance + profitAmount - debtsAmount;
    }

    function _balanceOf(address account, bool isRecursive) internal view returns (uint256, uint256, uint256){
        uint256 balance = super.balanceOf(account);

        RegularPayment[] memory userRegularPayments = _getActiveRegularPaymentsByUser(account);

        uint256 profitAmount = 0;
        for (uint i = 0; i < userRegularPayments.length; ++i) {
            if (userRegularPayments[i].to == account) {
                if (isRecursive) {
                    (uint256 amountFrom, uint256 profitAmountFrom, uint256 debtsAmountFrom) = _balanceOf(userRegularPayments[i].from, false);
                    if (amountFrom + profitAmountFrom < debtsAmountFrom) {
                        continue;
                    }
                }
                profitAmount += _getRegularPaymentAmount(userRegularPayments[i]);
            }
        }

        uint256 debtsAmount = 0;
        for (uint i = 0; i < userRegularPayments.length; ++i) {
            if (userRegularPayments[i].from == account) {
                debtsAmount += _getRegularPaymentAmount(userRegularPayments[i]);
            }
        }

        return (balance, profitAmount, debtsAmount);
    }

    function balanceOf(address account) public view override returns (uint256) {
        (uint256 balance, uint256 profitAmount, uint256 debtsAmount) = _balanceOf(account, true);
        return _calcBalance(balance, profitAmount, debtsAmount);
    }


    function transfer(address to, uint256 amount) public virtual override returns (bool) {
        address owner = _msgSender();
        require(balanceOf(owner) >= amount, "R_ERC20: transfer amount exceeds balance");
        return super.transfer(to, amount);
    }

    function checkRegularPaymentsByUser(address user) external view returns (RegularPayment[] memory) {
        (uint256 balance, uint256 profitAmount, uint256 debtsAmount) = _balanceOf(user, true);
        if (balance + profitAmount > debtsAmount)
            return new RegularPayment[](0);

        RegularPayment[] memory userRegularPayments = _getActiveRegularPaymentsByUser(user);

        uint256 debtsAmount2 = 0;
        uint length = 0;
        for (uint i = 0; i < userRegularPayments.length; ++i) {
            if (userRegularPayments[i].from == user) {
                debtsAmount2 += _getRegularPaymentAmount(userRegularPayments[i]);
                if (debtsAmount2 > balance + profitAmount) {
                    length++;
                }
            }
        }

        RegularPayment[] memory userDebtsRegularPayments = new RegularPayment[](length);

        uint256 debtsAmount3 = 0;
        uint j = 0;
        for (uint i = 0; i < userRegularPayments.length; ++i) {
            if (userRegularPayments[i].from == user) {
                debtsAmount3 += _getRegularPaymentAmount(userRegularPayments[i]);
                if (debtsAmount3 > balance + profitAmount) {
                    userDebtsRegularPayments[j] = userRegularPayments[i];
                    length++;
                }
            }
        }

        return userDebtsRegularPayments;
    }

}
