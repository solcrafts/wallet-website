---
name: agipocket-relay
version: 2.0.0
description: AGIPOCKET relay skill for agent-side request signing and wallet RPC operations on Solana.
homepage: https://wallet.solcraft.top
---

# AGIPOCKET Relay Skill (Agent Side)

This skill is for agent/client integration with the AGIPOCKET wallet extension through relay.

Default relay:
- `wss://wallet-relay.solcraft.top`

## Scope

- Generate sender Ed25519 keypair for relay identity
- Send `ed25519/v1` request packets to AGIPOCKET
- Receive `ed25519/v1` signed wallet responses
- Use Solana transaction flow for `mainnet` / `devnet` / `testnet`

## Security Rules

- Wallet private key stays inside AGIPOCKET extension
- Agent never asks user for wallet private key
- User must whitelist sender public key in AGIPOCKET before request execution

## End-to-End Flow

1. Agent generates sender keypair (`tweetnacl`), stores secret locally
2. Agent prints sender pubkey (hex or base58) to user
3. User adds sender pubkey into AGIPOCKET Trusted Apps whitelist
4. AGIPOCKET connects/auths to relay `wss://wallet-relay.solcraft.top`
5. Agent sends `{ target, payload }`
6. AGIPOCKET shows confirm popup (unless auto-confirm for trusted app)
7. Agent receives signed response packet and checks `nonce`

## Protocol Summary

### 1) Agent -> Relay -> Wallet
Envelope:

```json
{
  "target": "<wallet_base58_public_key>",
  "payload": {
    "protocol": "ed25519/v1",
    "data": {
      "nonce": 1715000000001,
      "id": "req-1715000000001",
      "timestamp": 1715000000,
      "method": "sign_transaction",
      "params": [
        {
          "chainId": "mainnet",
          "transaction": "<base64_serialized_solana_tx>",
          "skipPreflight": false,
          "maxRetries": 3
        }
      ]
    },
    "auth": {
      "pubkey": "<sender_pubkey_hex_or_base58>",
      "signature": "<ed25519_signature_hex_or_base58>"
    }
  }
}
```

Signing rule:
- `auth.signature = Ed25519Sign(JSON.stringify(payload.data), senderSecretKey)`

### 2) Wallet -> Relay -> Agent

```json
{
  "protocol": "ed25519/v1",
  "data": {
    "nonce": 1715000000001,
    "id": "req-1715000000001",
    "result": "...",
    "error": null,
    "code": 0
  },
  "auth": {
    "address": "<wallet_base58_public_key>",
    "signature": "<wallet_ed25519_signature_base58>"
  }
}
```

Validation rule:
- `data.nonce` must equal request nonce
- if `data.error != null`, treat as failure
- optional: verify `auth.signature` against `JSON.stringify(data)` and `auth.address`

## Supported Methods

### `get_address`
- params: `[]`
- result: wallet public key (base58)

### `sign_message`
- params: `[string | object]`
- result: signature (base58)

### `sign_transaction`
- params:
  - `params[0].chainId`: `"mainnet" | "devnet" | "testnet"`
  - `params[0].transaction`: base64 serialized Solana tx
- result: signed transaction (base64)

### `send_transaction`
- params:
  - `params[0].chainId`: `"mainnet" | "devnet" | "testnet"`
  - `params[0].transaction`: base64 serialized Solana tx
  - `params[0].skipPreflight` (optional): boolean
  - `params[0].maxRetries` (optional): number
- result: Solana tx signature (base58)

## ChainId Rules

Use string chain IDs only:
- `mainnet`
- `devnet`
- `testnet`

AGIPOCKET also accepts aliases internally (`mainnet-beta`, `101`, `103`, `102`), but agent integrations should send canonical string values above.

## Type Reference

```ts
type ChainId = "mainnet" | "devnet" | "testnet";

type SolanaTxParam = {
  chainId: ChainId;
  transaction: string; // base64 serialized tx
  skipPreflight?: boolean;
  maxRetries?: number;
};

type AGIPOCKETRequestData = {
  nonce: number;
  id?: string | number;
  timestamp: number;
  method: "get_address" | "sign_message" | "sign_transaction" | "send_transaction";
  params: [] | [string | object] | [SolanaTxParam];
};

type AGIPOCKETRequestPayload = {
  protocol: "ed25519/v1";
  data: AGIPOCKETRequestData;
  auth: {
    pubkey: string; // sender pubkey hex/base58
    signature: string; // signature hex/base58
  };
};

type AGIPOCKETEnvelope = {
  target: string; // wallet base58 pubkey
  payload: AGIPOCKETRequestPayload;
};

type AGIPOCKETResponse = {
  protocol: "ed25519/v1";
  data: {
    nonce: number;
    id?: string | number;
    result: unknown;
    error: string | null;
    code?: number;
  };
  auth: {
    address: string; // wallet base58 pubkey
    signature: string; // base58
  };
};
```

## Minimal Node Sender Example

```js
// npm i ws tweetnacl bs58 dotenv
require("dotenv").config();
const WebSocket = require("ws");
const nacl = require("tweetnacl");
const bs58 = require("bs58").default || require("bs58");

const WS_URL = process.env.WS_URL || "wss://wallet-relay.solcraft.top";
const TARGET = process.env.TARGET_ADDRESS; // wallet base58 address
const SECRET_B58 = process.env.SENDER_SECRET_KEY_B58;

if (!TARGET) throw new Error("Missing TARGET_ADDRESS");
if (!SECRET_B58) throw new Error("Missing SENDER_SECRET_KEY_B58");

const senderSecret = bs58.decode(SECRET_B58);
const sender = nacl.sign.keyPair.fromSecretKey(senderSecret);
const senderPubHex = Buffer.from(sender.publicKey).toString("hex");

function signData(data) {
  const sig = nacl.sign.detached(Buffer.from(JSON.stringify(data), "utf8"), sender.secretKey);
  return Buffer.from(sig).toString("hex");
}

(async function main() {
  const ws = new WebSocket(WS_URL);
  await new Promise((resolve, reject) => {
    ws.on("open", resolve);
    ws.on("error", reject);
  });

  const nonce = Date.now();
  const data = {
    nonce,
    id: `skill-${nonce}`,
    timestamp: Math.floor(Date.now() / 1000),
    method: "get_address",
    params: []
  };

  const request = {
    target: TARGET,
    payload: {
      protocol: "ed25519/v1",
      data,
      auth: {
        pubkey: senderPubHex,
        signature: signData(data)
      }
    }
  };

  ws.send(JSON.stringify(request));

  ws.on("message", (raw) => {
    const msg = JSON.parse(String(raw));
    if (msg.error) {
      console.error("Relay Error:", msg.error);
      process.exit(1);
    }

    if (msg.protocol === "ed25519/v1" && msg.data?.nonce === nonce) {
      if (msg.data.error) {
        console.error("Wallet Error:", msg.data.error);
        process.exit(1);
      }
      console.log("Wallet Result:", msg.data.result);
      process.exit(0);
    }
  });
})();
```

## Recommended `.env`

```env
WS_URL=wss://wallet-relay.solcraft.top
TARGET_ADDRESS=<wallet_base58_pubkey>
SENDER_SECRET_KEY_B58=<sender_64byte_secret_base58>
```

## Troubleshooting

### `Sender Public Key not in whitelist`
- Add sender pubkey to AGIPOCKET Trusted Apps
- Ensure auth pubkey matches the sender secret key used to sign

### `Missing or invalid chainId`
- For tx methods, use `mainnet` / `devnet` / `testnet`

### `Target wallet not connected`
- AGIPOCKET extension is offline or not authenticated to relay
- `target` is not the connected AGIPOCKET wallet address

### No response after popup confirm
- Check nonce matching logic on sender side
- Check method params shape against this skill
