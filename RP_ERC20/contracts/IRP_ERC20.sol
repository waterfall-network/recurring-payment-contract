// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";


interface IRP_ERC20 {
    enum RegularPaymentInterval {Second, Minute, Hour, Day, Week, Month, Year}

    struct RegularPayment {
        uint256 id;
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

    // Events
    /**
     * @dev Emitted when Regular Payment `id` is created by `creator`
     *
     */
    event CreatedRegularPayment(uint256 id, address creator, address from, address to, uint startTime, uint endTime, RegularPaymentInterval interval, uint256 amount, bool autoProlongation);

    /**
     * @dev Emitted when the Regular Payment `id` is approved by `user`
     */
    event ApprovedRegularPayment(uint256 id, address user);

    /**
     * @dev Emitted when the Regular Payment `id` is planed to cancel by `user` in `endTime`
     */
    event CanceledRegularPayment(uint256 id, uint endTime, address user);


    // Regular Payment functions

    /**
     * @dev Create Regular Payment  by `msg.sender`
     *
     * Returns Regular Payment `id` indicating whether the operation succeeded.
     *
     *
     * Emits an {CreatedRegularPayment} event.
     */
    function createRegularPayment(address from, address to, uint startTime, uint endTime, RegularPaymentInterval interval, uint256 amount, bool autoProlongation) external returns (uint256 id);

    /**
     * @dev Approve Regular Payment `id` by `msg.sender`
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     *
     * Emits an {ApprovedRegularPayment} event.
     */
    function approveRegularPayment(uint256 id) external returns (bool success);

    /**
     * @dev Cancel Regular Payment `id` by `msg.sender`.
     * `endTime` is last date when Regular Payment will be work.
     * `endTime` may be zero in which case  `endTime` will be now.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     *
     * Emits an {CanceledRegularPayment} event.
     */
    function cancelRegularPayment(uint256 id, uint endTime) external returns (bool success);

    // getters functions

    /**
     * @dev Returns all unpaid Regular Payments by `user`.
     */
    function checkRegularPaymentsByUser(address user) external view returns (RegularPayment[] memory);

    /**
     * @dev Returns the Regular Payments by `id`.
     */
    function getRegularPayment(uint256 id) external view returns (RegularPayment memory);

    /**
     * @dev Returns all Regular Payments by `msg.sender`.
     */
    function getMyRegularPayments() external view returns (RegularPayment[] memory);

    /**
     * @dev Returns all Regular Payments by `user`.
     */
    function getRegularPaymentsByUser(address user) external view returns (RegularPayment[] memory);

    /**
     * @dev Returns all Active Regular Payments by `user`.
     */
    function getMyActiveRegularPayments() external view returns (RegularPayment[] memory);

    /**
     * @dev Returns all Active Regular Payments by `msg.sender`.
     */
    function getActiveRegularPaymentsByUser(address user) external view returns (RegularPayment[] memory);

    /**
     * @dev Returns the unpaid amount of Regular Payment  by `id`.
     */
    function getRegularPaymentAmount(uint256 id) external view returns (uint256);

    //    // Override ERC-20 functions
    //    function balanceOf(address account) external view returns (uint256);
    //
    //    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    //
    //    function transfer(address to, uint256 amount) external returns (bool);

}