## Recurring Payment Contract

This repository is part of the IEEE [Standard for the Recurring Transactions on Distributed Ledger Technologies (DLTs)](https://standards.ieee.org/ieee/3228/11069/) work materials.

## Goal and Description

The Recurring Transactions on the Distributed Ledger Technologies (DLTs) Working Group for the development of a token standard (project P3228) was approved by the IEEE Computer Society/Blockchain and Distributed Ledgers (C/BDL) Standards Committee.

This novel token standard aims to ensure the implementation of recurring bill-pay functionality on decentralized platforms utilizing the Ethereum Virtual Machine (EVM). Automatic periodic payments, including subscription-based services, have gained significant traction in traditional fiat-money industries due to the various advantages they offer to both service providers and customers. However, current Distributed Ledger Technologies (DLTs) lack inherent non-custodial mechanisms to support such payment schemes. The primary objective of this standard is to furnish a comprehensive framework for the deployment of distributed ledger-based, non-custodial recurring payment methods across diverse industries, encompassing public services, banking, finance, insurance, real estate, commercial payments, and online services. The proposed standard presents an innovative approach executed through a smart contract that issues tokens on EVM-compatible networks.

In the first stage, an algorithm for implementing the essential functions of regular payments was developed and implemented in the form of a smart contract. In the second stage, the functionality will be expanded and the algorithm will be optimized. In the third stage, it is proposed to introduce a full-fledged system into the blockchain for use in DeFi and to create new financial services that provide traditional banking products based on decentralized public platforms.

## Research & Development Work Group

<table><tbody><tr><td><img src="https://github.com/waterfall-foundation/recurring-payment-contract/blob/main/photos/LordN.png" width="36%"><h3>Oleksandr Nashyvan</h3><p>MSc<strong> Oleksandr Nashyvan</strong> is a developers team lead of the Waterfall project. In 2009, he received a master's degree in software for automated systems from Odesa National Polytechnic University. After graduating from the university, he worked as a developer, team leader, and CTO in several companies. Since 2018, he has been consistently working on blockchain and DLT-related projects.</p></td><td><img src="https://github.com/waterfall-foundation/recurring-payment-contract/blob/main/photos/LordN.png" width="36%"><h3>Oleksandr Nashyvan</h3><p>MSc<strong> Oleksandr Nashyvan</strong> is a developers team lead of the Waterfall project. In 2009, he received a master's degree in software for automated systems from Odesa National Polytechnic University. After graduating from the university, he worked as a developer, team leader, and CTO in several companies. Since 2018, he has been consistently working on blockchain and DLT-related projects.</p></td><td><img src="https://github.com/waterfall-foundation/recurring-payment-contract/blob/main/photos/Leonchyk.png" width="30%"><h3>Yevhen Leonchyk</h3><p>Dr.<strong> Yevhen Leonchyk</strong> has been working as an associate professor in the Department of Mathematical Analysis at Odesa I.I.Mechnikov National University. He got his Ph.D. in Physics and Mathematics. His research expertise lies in the mathematical modeling of complex systems such as computer, environmental, and economic systems. For the last seven years, he has been actively involved in numerous projects related to decentralized public and private systems.</p></td><td><img src="https://github.com/waterfall-foundation/recurring-payment-contract/blob/main/photos/mazurok.jpg" width="30%"><h3>Igor Mazurok</h3><p>Dr.<strong> Igor Mazurok</strong> is an Associated Professor of the Department of Optimal Control and the Economical Cybernetics Odesa I.I.Mechnikov National University, Head of the Scientific Center for Algorithms and Programming, Ph.D. in Computer Sciences. His research interest is Data analysis and decentralized systems modeling; DLT and blockchain architecture solution development; Semantic and pragmatic big data analysis. He has participated in international research by IEEE and other institutions.</p></td></tr></tbody></table>



## Roadmap

### STAGE I. Recurring payments and subscriptions

1.  Formulating an idea based on the mission of the project and the direction of its development. General knowledge of the problem. Formulation of specific goals and objectives. (completed)
2.  Studying related works. Critical analysis of existing solutions, token standards, and review of scientific literature. (completed)
3.  Effecting payments. The general concept, priority queue, and deferred virtual transaction. Algorithms. (completed)
4.  Creating a Smart Contract Prototype. The proposed payment and token accounting scheme should be implemented as a smart contract running on the Ethereum network, or another system with a compatible virtual machine. (in progress)
5.  Publication preparation (2022). An abstract for the IEEE 1st GET Blockchain Forum, California, United States. (completed)
6.  Publication preparation (2023). An abstract for IEEE 1st Ukrainian Distributed Ledger Technology Forum (UADLTF), Kyiv, Ukraine. (in progress)
7.  Prototype testing. Test the algorithm for commission costs; compare the results with commissions without this standard. (in progress)

### Stage II. Recurring payments and subscriptions: Advanced Topics

1.  Auxiliary features. With the involvement of a consultant from the financial domain, we determine a list of features that needs to be implemented. Find ways to “cut out” the necessary functions from the complete accounting system (e.g., chargeback).
2.  Penalties may be accrued on incurred debts. Study and specification of problems. 
3.  Freeze – suspension of subscription payments.
4.  Clearing system. Netting of ring debts.
5.  Interaction with other smart contracts.
6.  The case of a change in the payment amount during the subscription period. The payment amount may change during the subscription period and such information could be stored outside the network. However, smart contracts cannot access external data on their own. To make this happen, special applications, so-called oracles, put the necessary information on the blockchain on a regular basis or by a smart contract request.
7.  Creating a web application. Implement a web application to demonstrate a smart contract.

### Stage III. Use cases in DeFi

1.  DeFi: Concept, terminology, use cases. Develop terminology for North America and Europe with accounting professionals (different approaches) and integrate it if possible. Draw up a list of banking and payment mechanisms to be implemented, at least those that are generally accepted and widely used.
2.  Use case examples. For each use case, several popular use case examples.
3.  List of tasks based on the results of the paragraph. If not all tasks formulated during communication with economists can be solved on the fly, then we will finish here. The list of tasks in order of importance should be agreed upon by the working group. This depends on the amount of time needed.

## Install

`yarn`

## Compile

### RP\_ERC20

`yarn run compile-rp-erc20`

## Deploy

### RP\_ERC20

`yarn run deploy-rp-erc20`

## ToDo

*   [ ] add auto prolongation function
*   [ ] add tests for transfer and transfer from
*   [ ] add recursion for balance/check RP/transfer
*   [ ] improve algorithm Recurring Payment transaction
*   [ ] refactoring code
