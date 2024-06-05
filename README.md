
<h1 align="center">
  <br>
  
  <br>
  P2P Chat App
  <br>
</h1>

<h4 align="center">A Simple P2P Chat app build with <a href="https://nextjs.org" target="_blank">Next.js</a>.</h4>

## Table of Contents

- [Introduction](#introduction)
- [Architecture](#architecture)
- [Features](#features)

## Introduction

We are building an exciting peer-to-peer securechat application for our first year development project. The web app connects people and groups of people of up to ## members and provides both file and image transfer functionalities, as well as audio and video calls between peers.

In order to make sure our application functions correctly, we are using multiple protocols and functionalities in order to secure the basic foundations of a chat application. Notably, storage and peer discovery are important aspects to which we took time to find technical solutions. 

## Architecture

- This chat application is based on a decentralized peer-to-peer architecture.
- We considered many protocols and methods to secure multiple tasks.
- We chose Next.js for the front end due to its robust features like server-side rendering, static site generation, and seamless integration with React.
- These features enhance performance and SEO.
- Tailwind CSS was selected for its utility-first approach, allowing rapid and efficient styling.
- Tailwind's customizable design system promotes consistency and reduces development time.
- Together, these technologies provide a scalable, high-performance, and visually appealing user experience.
- We chose WebRTC for peer discovery to enable real-time communication directly between users' browsers.
- WebRTC ensures low-latency, high-quality audio and video transmission without plugins.
- A signaling server is indispensable for establishing peer-to-peer connections.
- The signaling server facilitates the exchange of connection information and media metadata between peers.
- Without this server, peers cannot negotiate direct communication connections.
- We use RSA (asymmetric) and AES (symmetric) encryption methods for data encryption.
- RSA is used for securely exchanging keys between users.
- Once the secure channel is established, AES is used for actual data transmission.
- AES is efficient and fast, providing robust security and high performance.
- This hybrid approach ensures secure key exchange and strong data encryption.
- We chose GunDB for the storage part, leveraging its integration with IPFS.
- GunDB provides decentralized, resilient, and efficient data storage.
- GunDB's graph-based structure allows real-time data synchronization and offline capabilities.
- Using IPFS enhances data availability, integrity, and redundancy across a peer-to-peer network.
- This combination ensures robust, scalable, and fault-tolerant storage, making user data consistently accessible and secure.


## Key Features

- Secure Messaging
- Audio calls
- Video calls
- File transfer
- Dark/light mode
- Group messaging
- Blocking users
- English and French language
- Image sending
- 

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.


