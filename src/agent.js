import Hyperswarm from 'hyperswarm'
import crypto from 'crypto'

const AGENT_ID = crypto.randomBytes(4).toString('hex')
const c = { reset:'\x1b[0m', cyan:'\x1b[36m', green:'\x1b[32m', yellow:'\x1b[33m', magenta:'\x1b[35m', bold:'\x1b[1m' }

console.log(\n╔══════════════════════════════════════════════╗)
console.log(║   Intercom Task Agent · ID:          ║)
console.log(║   Listening for orchestrator tasks ...       ║)
console.log(╚══════════════════════════════════════════════╝\n)

async function main() {
  const topic = crypto.createHash('sha256').update('intercom-ai-orchestrator-v1').digest()
  const swarm = new Hyperswarm()
  swarm.on('connection', (conn, info) => {
    const peerId = info.publicKey.toString('hex').slice(0,12)
    console.log(${c.cyan}[AGENT] Connected to orchestrator )
    conn.on('data', async (data) => {
      try {
        const msg = JSON.parse(data.toString())
        if (msg.type !== 'orchestrator_task') return
        console.log(${c.yellow}[TASK] Received task # []: )
        await new Promise(r => setTimeout(r, 2000))
        console.log(${c.green}[✓] Task # complete)
        conn.write(JSON.stringify({ type:'subtask_ack', taskId:msg.subtask.id, agentType:msg.subtask.agentType, status:'done', agentId:AGENT_ID, timestamp:Date.now() }))
      } catch(e) {}
    })
    conn.on('error', ()=>{})
  })
  await swarm.join(topic, { server:true, client:true })
  console.log(${c.cyan}[AGENT] Joined sidechannel. Waiting for tasks...\n)
  process.on('SIGINT', async () => { await swarm.destroy(); process.exit(0) })
}

main().catch(e => { console.error(e); process.exit(1) })
