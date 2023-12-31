import { platform } from 'process'

import test from 'ava'

import { runFixture } from '../helpers/main.js'

if (platform !== 'win32') {
  test('build.command uses Bash', async (t) => {
    await runFixture(t, 'bash')
  })

  test('build.command can execute shell commands', async (t) => {
    await runFixture(t, 'shell')
  })
}

test('build.command can execute global binaries', async (t) => {
  await runFixture(t, 'global_bin')
})

test('build.command can execute local binaries', async (t) => {
  await runFixture(t, 'local_bin')
})

test('build.command use correct PWD', async (t) => {
  await runFixture(t, 'pwd')
})

test('build.command from UI settings', async (t) => {
  const defaultConfig = { build: { command: 'node --version' } }
  await runFixture(t, 'none', { flags: { defaultConfig } })
})

test('Invalid package.json does not make build fail', async (t) => {
  await runFixture(t, 'invalid_package_json')
})
