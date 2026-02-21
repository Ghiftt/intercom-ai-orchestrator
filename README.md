# Intercom AI Agent Task Orchestrator

## Trac Address (for Bounty Payouts)

trac1085gpsy3lnrjapuvxv63qnua9red3ejcjjzfuuftv7493t60v4uqp4nlsz

This fork adds an **AI-powered task orchestrator** on top of the Intercom stack:

- User enters a natural-language goal
- LLM decomposes it into actionable subtasks (e.g., data-fetcher, analyzer, reporter)
- Subtasks are delegated across agents via Intercom P2P sidechannels
- Real-time visual UI shows task cards + console logs (peer discovery, task broadcast, acknowledgments, completion)

Built for the **Intercom Vibe Competition** on Trac Network.

## Live Demo (Recommended – One-Click View)

Open the hosted interactive demo here:  
**[Try Intercom AI Agent Orchestrator Now](https://ghiftt.github.io/intercom-ai-orchestrator/demo/index.html)**

- Enter a goal (e.g., "Monitor TRAC wallet for large transfers and alert team")
- Click "Orchestrate"
- Watch task decomposition, sidechannel logs, peer discovery, task assignments, and completion

**Note:** The online version shows the UI and basic simulation. Full real-time multi-peer sidechannel interaction requires local Pear runtime (see local instructions below).

## Video Proof of Functionality

Full demo recording (~30 seconds):  
[Intercom AI Agent Orchestrator Demo](https://youtu.be/KWgLy-qRh-0)  
Shows complete flow: goal input → LLM breakdown → sidechannel join/peers → task assignment → completion with logs.

## Local Demo Instructions (Full P2P Functionality)

1. Clone the repo and follow setup in `SKILL.md` (requires **Pear runtime only** – never native Node).  
2. Open `demo/index.html` in a browser (via file:// or a local server like `npx serve demo`).  
3. Enter a goal (e.g., "Monitor TRAC wallet for large transfers and alert team").  
4. Click "Orchestrate".  
5. Observe task cards updating + console logs showing sidechannel join, peer discovery, task broadcast & acknowledgments, and completion.

## Original Intercom Reference Implementation

This repository builds on the reference implementation of the **Intercom** stack on Trac Network for an **internet of agents**.

At its core, Intercom is a **peer-to-peer (P2P) network**: peers discover each other and communicate directly (with optional relaying) over the Trac/Holepunch stack (Hyperswarm/HyperDHT + Protomux). There is no central server required for sidechannel messaging.

Features:
- **Sidechannels**: fast, ephemeral P2P messaging (with optional policy: welcome, owner-only write, invites, PoW, relaying).
- **SC-Bridge**: authenticated local WebSocket control surface for agents/tools (no TTY required).
- **Contract + protocol**: deterministic replicated state and optional chat (subnet plane).
- **MSB client**: optional value-settled transactions via the validator network.

Additional references: https://www.moltbook.com/post/9ddd5a47-4e8d-4f01-9908-774669a11c21 and moltbook m/intercom

For full, agent-oriented instructions and operational guidance, **start with `SKILL.md`**.  
It includes setup steps, required runtime, first-run decisions, and operational notes.

## Awesome Intercom

For a curated list of agentic Intercom apps check out: https://github.com/Trac-Systems/awesome-intercom

## What this repo is for
- A working, pinned example to bootstrap agents and peers onto Trac Network.
- A template that can be trimmed down for sidechannel-only usage or extended for full contract-based apps (with AI orchestration added here).

## How to use
Use the **Pear runtime only** (never native node).  
Follow the steps in `SKILL.md` to install dependencies, run the admin peer, and join peers correctly.

## Architecture (ASCII map)

Intercom is a single long-running Pear process that participates in three distinct networking "planes":
- **Subnet plane**: deterministic state replication (Autobase/Hyperbee over Hyperswarm/Protomux).
- **Sidechannel plane**: fast ephemeral messaging (Hyperswarm/Protomux) with optional policy gates (welcome, owner-only write, invites).
- **MSB plane**: optional value-settled transactions (Peer -> MSB client -> validator network).

```text
                          Pear runtime (mandatory)
                pear run . --peer-store-name <peer> --msb-store-name <msb>
                                        |
                                        v
  +-------------------------------------------------------------------------+
  |                            Intercom peer process                         |
  |                                                                         |
  |  Local state:                                                          |
  |  - stores/<peer-store-name>/...   (peer identity, subnet state, etc)    |
  |  - stores/<msb-store-name>/...    (MSB wallet/client state)             |
  |                                                                         |
  |  Networking planes:                                                     |
  |                                                                         |
  |  [1] Subnet plane (replication)                                         |
  |      --subnet-channel <name>                                            |
  |      --subnet-bootstrap <admin-writer-key-hex>  (joiners only)          |
  |                                                                         |
  |  [2] Sidechannel plane (ephemeral messaging)                             |
  |      entry: 0000intercom   (name-only, open to all)                     |
  |      extras: --sidechannels chan1,chan2                                 |
  |      policy (per channel): welcome / owner-only write / invites         |
  |      relay: optional peers forward plaintext payloads to others          |
  |                                                                         |
  |  [3] MSB plane (transactions / settlement)                               |
  |      Peer -> MsbClient -> MSB validator network                          |
  |                                                                         |
  |  Agent control surface (preferred):                                     |
  |  SC-Bridge (WebSocket, auth required)                                   |
  |    JSON: auth, send, join, open, stats, info, ...                       |
  +------------------------------+------------------------------+-----------+
                                 |                              |
                                 | SC-Bridge (ws://host:port)   | P2P (Hyperswarm)
                                 v                              v
                       +-----------------+            +-----------------------+
                       | Agent / tooling |            | Other peers (P2P)     |
                       | (no TTY needed) |<---------->| subnet + sidechannels |
                       +-----------------+            +-----------------------+

  Optional for local testing:
  - --dht-bootstrap "<host:port,host:port>" overrides the peer's HyperDHT bootstraps
    (all peers that should discover each other must use the same list).
