import type HoprCoreConnector from '@hoprnet/hopr-core-connector-interface'
import type Hopr from '@hoprnet/hopr-core'
import { AbstractCommand } from './abstractCommand'
import type { AutoCompleteResult } from './abstractCommand'

import type PeerId from 'peer-id'

import { checkPeerIdInput, isBootstrapNode, getPeers } from '../utils'
import chalk from 'chalk'

export default class Ping extends AbstractCommand {
  constructor(public node: Hopr<HoprCoreConnector>) {
    super()
  }
  name() { return 'ping' }
  help() { return 'pings another node to check its availability' }

  async execute(query?: string): Promise<void> {
    if (query == null) {
      console.log(chalk.red(`Invalid arguments. Expected 'ping <peerId>'. Received '${query}'`))
      return
    }

    let peerId: PeerId
    try {
      peerId = await checkPeerIdInput(query)
    } catch (err) {
      console.log(chalk.red(err.message))
      return
    }

    if (isBootstrapNode(this.node, peerId)) {
      console.log(chalk.gray(`Pinging the bootstrap node ...`))
    }

    try {
      const latency = await this.node.ping(peerId)
      console.log(`Pong received in:`, chalk.magenta(String(latency)), `ms`)
    } catch (err) {
      console.log(`Could not ping node. Error was: ${chalk.red(err.message)}`)
    }
  }

  async autocomplete(query: string, line: string): Promise<AutoCompleteResult> {
    const peers = getPeers(this.node)

    const peerIds =
      !query || query.length == 0
        ? peers.map((peer) => peer.toB58String())
        : peers.reduce((acc: string[], peer: PeerId) => {
            const peerString = peer.toB58String()
            if (peerString.startsWith(query)) {
              acc.push(peerString)
            }

            return acc
          }, [])

    if (!peerIds.length) {
      return [[''], line]
    }

    return [peerIds.map((peerId: string) => `ping ${peerId}`), line]
  }
}
