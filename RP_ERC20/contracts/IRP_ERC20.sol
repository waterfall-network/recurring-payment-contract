// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";


interface IRP_ERC20 {
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

    // events
    event CreatedRegularPayment(bytes32 id, address creator, address from, address to, uint startTime, uint endTime, RegularPaymentInterval interval, uint256 amount, bool autoProlongation);
    event ApprovedRegularPayment(bytes32 id, address user);
    event CanceledRegularPayment(bytes32 id, uint endTime, address user);



    // Regular Payment functions
    function createRegularPayment(address from, address to, uint startTime, uint endTime, RegularPaymentInterval interval, uint256 amount, bool autoProlongation) external returns (bytes32 id);

    function approveRegularPayment(bytes32 id) external returns (bool success);

    function cancelRegularPayment(bytes32 id, uint endTime) external returns (bool success);

    // getters functions
    function checkRegularPaymentsByUser(address user) external view returns (RegularPayment[] memory);

    function getRegularPayment(bytes32 id) external view returns (RegularPayment memory);

    function getMyRegularPayments() external view returns (RegularPayment[] memory);

    function getRegularPaymentsByUser(address user) external view returns (RegularPayment[] memory);

    function getMyActiveRegularPayments() external view returns (RegularPayment[] memory);

    function getActiveRegularPaymentsByUser(address user) external view returns (RegularPayment[] memory);

    function getRegularPaymentAmount(bytes32 id) external view returns (uint256);

//    // Override ERC-20 functions
//    function balanceOf(address account) external view returns (uint256);
//
//    function transferFrom(address from, address to, uint256 amount) external returns (bool);
//
//    function transfer(address to, uint256 amount) external returns (bool);

}