# SKILL: AI Agent Task Orchestrator

## Identity
- **Name**: intercom-ai-orchestrator
- **Version**: 1.0.0
- **Network**: Trac Network / Intercom P2P sidechannel

## Trac Address
trac1085gpsy3lnrjapuvxv63qnua9red3ejcjjzfuuftv7493t60v4uqp4nlsz

## What This Agent Does
Takes a natural-language goal, decomposes it into 2-4 subtasks using an LLM, assigns each subtask an agent type, and broadcasts them over the Intercom P2P sidechannel for downstream agents to execute.

## How to Invoke
node src/orchestrator.js --goal "Monitor TRAC wallet for large transfers"

## Agent Types
- data-fetcher: collects data from network sources
- analyzer: processes and identifies patterns
- reporter: generates output and dispatches alerts

## Sidechannel Topic
SHA-256("intercom-ai-orchestrator-v1")

## Live Demo
https://ghiftt.github.io/intercom-ai-orchestrator/demo/index.html

## Dependencies
- Node.js 18+
- hyperswarm
- OpenAI API key (optional)
