import * as root from '../index'
const mod = root.commands

describe('Commands', () => {

  it('can import commands', () => {
    expect(mod).toBeDefined()
  }) 

  it('can construct Commands object', () => {
    let mockNode: any = jest.fn()
    expect(mod.Commands).toBeDefined()
    let cmds = new mod.Commands(mockNode)
    expect(cmds).toBeTruthy()
    expect(cmds.crawl).toBeTruthy()
  })

})

