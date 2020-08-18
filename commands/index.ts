import type HoprCoreConnector from '@hoprnet/hopr-core-connector-interface'
import type Hopr from '@hoprnet/hopr-core'
import type AbstractCommand from './abstractCommand'

import CloseChannel from './closeChannel'
import Crawl from './crawl'
import ListCommands from './listCommands'
import ListConnectors from './listConnectors'
import ListOpenChannels from './listOpenChannels'
import OpenChannel from './openChannel'
import Ping from './ping'
import PrintAddress from './printAddress'
import PrintBalance from './printBalance'
import SendMessage from './sendMessage'
import StopNode from './stopNode'
import Version from './version'
import Tickets from './tickets'
import IncludeRecipient from './includeRecipient'
import readline from 'readline'

export const SPLIT_OPERAND_QUERY_REGEX: RegExp = /([\w\-]+)(?:\s+)?([\w\s\-.]+)?/

export class Commands {
  readonly commands: AbstractCommand[]
  private commandMap: Map<string, AbstractCommand>

  constructor(public node: Hopr<HoprCoreConnector>, rl?: readline.Interface) {
    this.commands = [
      new CloseChannel(node),
      new Crawl(node),
      new ListCommands(() => this.commands),
      new ListConnectors(),
      new ListOpenChannels(node),
      new Ping(node),
      new PrintAddress(node),
      new StopNode(node),
      new Version(),
      new Tickets(node),
    ]

    if(rl) {
      this.commands.push(new OpenChannel(node, rl))
      this.commands.push(new SendMessage(node, rl))
      this.commands.push(new IncludeRecipient(node, rl))
    }
    this.commandMap = new Map()
    for (let command of this.commands) {
      if (this.commandMap.has(command.name())){
        throw new Error(`Duplicate commands for ${command}`)
      }
      this.commandMap.set(command.name(), command)
    }
  }

  public find(command: string): AbstractCommand {
    return this.commandMap.get(command.trim())
  }
  
  public async execute(message: string): Promise<void> {
    const [command, query]: (string | undefined)[] = message.trim().split(SPLIT_OPERAND_QUERY_REGEX).slice(1)

    if (command == null) {
      return;
    }

    let cmd = this.find(command)
    
    if (cmd){
      return await cmd.execute(query)
    }
  }

  public async complete(message: string): Promise<void> {
    const [command, query]: (string | undefined)[] = message.trim().split(SPLIT_OPERAND_QUERY_REGEX).slice(1)

  }
}
