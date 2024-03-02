# Nosh

**What we’re working on**

We are designing a new communication standard; a set of rules and technical specifications for building open e-commerce networks across which providers and their services are universally discoverable from any protocol-enabled application.

We’re currently hiring engineers and researchers.

## Jobs

- [Distributed Systems Engineer](./DS_ENG.md)
- [Founding Engineer](./PRODUCT_ENG.md)

To apply, [email mike](mailto:mike@noshdelivery.co) with a link to your GitHub / LinkedIn / personal website or cv.


## Interview Challenges (Distributed Systems)

### Implement Key-Pair Infrastructure with Intel SGX Secure Enclaves
Write a secure [trusted execution environment](https://en.wikipedia.org/wiki/Trusted_execution_environment) using [Intel SGX secure enclaves](https://www.intel.com/content/dam/develop/external/us/en/documents/overview-of-intel-sgx-enclave-637284.pdf). Intel SGX can be used for public-private key store infrastructure. This TEE will be used by Gateway Providers of the protocol network. The TEE will securely execute attestations for buyers and sellers in the network during their transaction lifecycle.

The design should support basic [webAuthN](https://www.w3.org/TR/webauthn-2/) operations for 
- key-pairs generation (registration). 
- transaction signing (authentication).

The TEE will interface with our [native library for passkeys](https://github.com/Palette-Labs-Inc/passkeys). Your Intel SGX enclave will serve as a TEE to individuals within the network, support self-custodial wallet generation (ethereum key-pair) for users of the network, allowing them to sign transactions with their biometrics, and ultimately proving the validity of their contributions. 

Contact [mike](mailto:mike@noshdelivery.co) if you have questions about starting the task.

___
### Design a Graph Theoretical Token Resolver Contract w/ the Ethereum Attestation Service
We are introducing a graph theoretic approach to blockchain tokenomics for decentralized physical infrastructure networks.Token distributions are intended to effectively matches producers (i.e - sellers of products or services) with buyers in the context of commercial markets. This approach aims to overcome the downfalls of existing approaches to token economies for physical infrastructure networks through a self-optimized token distributions that scale dynamicaly with the state of the graph. The graph will be represented by the nodes (individual buyers or providers) and edges (previous transactions) in the [graph](https://en.wikipedia.org/wiki/Graph_theory#:~:text=In%20mathematics%2C%20graph%20theory%20is,also%20called%20links%20or%20lines)

The graph should be updated when a buyer and seller transact - transactions will be a simple combination of attestations using the [ethereum attestation service](https://docs.attest.sh/docs/welcome).  

This project has three components: 
- A new entry in the EAS schema registry representing a commercial transaction in a two sided marketplace.
- A [Resolver contract](https://docs.attest.sh/docs/core--concepts/resolver-contracts) that burns, mints, and distributes tokens to the buyer and seller in the transaction as a function of the state of the graph's nodes and edges.
- A fork of the [EAS indexing service](https://github.com/ethereum-attestation-service/eas-indexing-service) to extract all transactions of your relevant schema entries and model the graph visually.

Note, this can be a simplified proof-of-concept. You can email [mike](mailto:mike@noshdelivery.co) if you have questions about starting the task or the math required in the resolver contract. 

___
### Network Registry Infrastructure
We are designing a federated, server-to-server architecture for commercial markets. The design supports an interoperable network of independently hosted Provider Supporting Servers and Buyer Supporting Servers that are responsible for onboarding participants on either side of the network.

The network registry is a decentralized public ledger that maintains the records of Node Operators (network servers), agents, their supported Industry Codes, and the geographical regions that they represent. The registry is queried for a Producers products or services during the search phase of a Buyers transaction lifecycle. 

All registered Node Operators self-maintain a `location` field in the registry table. The location field supports an array of strings that represent a [`Hexagonal Hierarchical Spatial Index`](https://github.com/uber/h3). This index provides a precise and performant way to easily represent and query geospatial data on the blockchain. 

Design the network registry, submit it to a github repository, and [deploy the registry contract to base-spolia using hardhat](https://docs.base.org/guides/deploy-smart-contracts/) 

This project has two components: 
- A repository with the network registry contract written in solidity
- A fork of the [EAS indexing service](https://github.com/ethereum-attestation-service/eas-indexing-service) and GraphQL resolver to index and maintain the registry infrastructure w/ [PostgreSQL bindings for the H3 Core Library](https://github.com/zachasme/h3-pg) bindings.

Contact [mike](mailto:mike@noshdelivery.co) if you have questions about the structure of the registry table.

___
## License

[License](./LICENSE.md)