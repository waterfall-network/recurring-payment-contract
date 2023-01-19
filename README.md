## Recurring Payment Contract

This repository is part of the IEEE [Standard for the Recurring Transactions on Distributed Ledger Technologies (DLTs)](https://opensource.ieee.org/oscom/official-project-requests/-/issues/15) work materials.

## Goal and Description

The Recurring Transactions on the Distributed Ledger Technologies (DLTs) Working Group for the development of a token standard (project P3228) was approved by the IEEE Computer Society/Blockchain and Distributed Ledgers (C/BDL) Standards Committee. The purpose of this standard is to provide a resource for implementing blockchain and distributed ledger-based recurring payment methods in relevant industries, including public services, banking, finance, insurance, real estate, commercial payments, and online services.  

The project solves the problem of increasing the efficiency of regular payments using a special token standard. To solve the problem, it has been proposed to supplement existing distributed ledger technologies with Accrual Accounting (AA) elements.
In the first stage, an algorithm for implementing the basic functions of regular payments was developed and implemented in the form of a smart contract. In the second stage, functionality will be expanded and the algorithm will be optimized. In the third stage, it is proposed to introduce a full-fledged AA system into the blockchain for use in DeFi and to create new financial services that provide traditional banking products based on decentralized public platforms.
In the upcoming second and third stages, it is necessary to include a researcher on the team with experience in scientific and practical development in the field of AA (for a certain period, or for systematic consultations).   

## Research Work Group

<table><tbody><tr><td><h3>Oleksandr Nashyvan</h3><p><strong>Oleksandr Nashyvan</strong> is a developers team lead of the Waterfall project. In 2009, he received a master's degree in software for automated systems from the Odessa National Polytechnic University. After graduating from the university, he worked as a developer, team leader, and CTO in several companies. Since 2018, he has been working on blockchain-related projects. At the moment, he is participating in research on the Waterfall project and leading the development team.</p></td><td><h3>Yevhen Leonchyk</h3><p>Dr.<strong> Yevhen Leonchyk</strong> has been working as an associate professor in the Department of Mathematical Analysis at Odesa I.I. Mechnikov National University delivering lectures on mathematical methods and computer simulation since 2002. He got his Ph.D. in Physics and Mathematics. His research interest is the mathematical modeling of computer, environmental and economic complex systems. Dr. Leonchyk has been participating in international scientific studies. For six last years, he has been actively involved in projects addressing blockchain technology.</p></td><td><h3>Igor Mazurok</h3><p>Dr.<strong> Igor Mazurok</strong> is an Associated Professor of the Department of Optimal Control and the Economical Cybernetics Odesa I.I.Mechnikov National University (Ukraine), Head of the Scientific Center for Algorithms and Programming, Ph.D. in Computer Sciences, Master of Applied Mathematics. His research interest is Data analysis and decentralized systems modeling; DLT and blockchain architecture solutions development; Semantic and pragmatic big data analysis. Dr. Igor Mazurok has participated in international scientific research by IEEE and other institutions.</p></td></tr></tbody></table>

## Developers Team

…

## Roadmap

### STAGE I. Recurring payments and subscriptions

1.  Formulating an idea based on the mission of the project and the direction of its development. General knowledge of the problem. Formulation of specific goals and objectives. (completed)
2.  Studying related works. Critical analysis of existing solutions, standards, and review of scientific literature. (completed)
3.  Payment Logic Design. General Concept, Balance and Transfer Types, Debt Processing, Wire Transfer, Clearing System. (completed)
4.  Creating a Smart Contract Prototype. The proposed payment and token accounting scheme have to be implemented as a smart contract running on the Ethereum network, or another system with a compatible virtual machine. (in progress)
5.  Publication preparation. An abstract for the IEEE 1st GET Blockchain Forum, California, United States. (completed)
6.  Prototype testing. Test the algorithm for commission costs; compare the results with commissions without this standard.

### Stage II. Recurring payments and subscriptions: Advanced Topics

1.  Restricted Accrual Accounting. With the involvement of a consultant from the financial domain, we determine a list of the minimal elements of standard AA (accrual accounting)  that need to be implemented. Find ways to “cut out” the necessary functions from the complete system. Accrual of penalty on outstanding debts
2.  Fees may accrue on incurred debts. Study and specification of problems. 
3.  Freeze – suspension of subscription payments
4.  Another calculation algorithm (or modernization of the old one)
5.  Netting of ring debts
6.  Interaction with other smart contracts
7.  The case of a change in the payment amount during the subscription period. The payment amount may change during the subscription period and such information could be stored outside the network. However, smart contracts cannot access external data on their own. To make this happen, special applications, so-called oracles, put the necessary information on the blockchain on a regular basis or by a smart contract request.
8.  Creating a web application. Implement a web application to demonstrate a smart contract

### Stage III. Accrual Accounting in DeFi

1.  DeFi: Concept, terminology, use cases. Develop terminology for North America and Europe in contact with accounting professionals (different approaches), and integrate them if possible. Draw up a list of banking and payment mechanisms to be implemented, at least those that are generally accepted and widely used
2.  Use case examples. For each use case, several popular use case examples.
3.  List of tasks based on the results of the paragraph. If not all tasks formulated during communication with economists can be solved on the fly, then we will finish here. The list of tasks in order of importance will need to be agreed upon by the working group. This depends on the amount of time needed.

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
