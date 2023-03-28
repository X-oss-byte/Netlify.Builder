import { join } from 'path'

import { beforeEach, describe, expect, test } from 'vitest'

import { mockFileSystem } from '../../tests/mock-file-system.js'
import { NodeFS } from '../node/file-system.js'
import { Project } from '../project.js'

beforeEach((ctx) => {
  ctx.fs = new NodeFS()
})

describe('Next.js Plugin', () => {
  beforeEach((ctx) => {
    ctx.cwd = mockFileSystem({
      'package.json': JSON.stringify({
        name: 'my-next-app',
        version: '0.1.0',
        private: true,
        scripts: {
          dev: 'next dev',
          build: 'next build',
          start: 'next start',
        },
        dependencies: {
          next: '10.0.5',
          react: '17.0.1',
          'react-dom': '17.0.1',
        },
      }),
    })
  })

  test('Should detect Next.js plugin for Next.js if when Node version >= 10.13.0', async ({ fs, cwd }) => {
    const project = new Project(fs, cwd).setNodeVersion('v10.13.0')
    const frameworks = await project.detectFrameworks()
    expect(frameworks?.[0].id).toBe('next')
    expect(frameworks?.[0].plugins).toEqual(['@netlify/plugin-nextjs'])
  })

  test('Should not detect Next.js plugin for Next.js if when Node version < 10.13.0', async ({ fs, cwd }) => {
    const project = new Project(fs, cwd).setNodeVersion('v8.3.1')
    const frameworks = await project.detectFrameworks()
    expect(frameworks?.[0].id).toBe('next')
    expect(frameworks?.[0].plugins).toHaveLength(0)
  })
})

describe('simple Next.js project', async () => {
  beforeEach((ctx) => {
    ctx.cwd = mockFileSystem({
      'package.json': JSON.stringify({
        name: 'my-next-app',
        version: '0.1.0',
        private: true,
        scripts: {
          dev: 'next dev',
          build: 'next build',
          start: 'next start',
        },
        dependencies: {
          next: '10.0.5',
          react: '17.0.1',
          'react-dom': '17.0.1',
        },
      }),
    })
  })

  test('should detect Next.js based on a simple package.json dependency', async ({ fs, cwd }) => {
    const detected = await new Project(fs, cwd).detectFrameworks()
    expect(detected?.[0].id).toBe('next')
  })

  test('Should not detect Next.js plugin for Next.js if no node version is defined', async ({ fs, cwd }) => {
    const detected = await new Project(fs, cwd).detectFrameworks()
    expect(detected?.[0].id).toBe('next')
    expect(detected?.[0].plugins).toHaveLength(0)
  })

  test('Should not detect Next.js plugin for Next.js if when Node version < 10.13.0', async ({ fs, cwd }) => {
    const detected = await new Project(fs, cwd).setNodeVersion('v8.3.0').detectFrameworks()
    expect(detected?.[0].id).toBe('next')
    expect(detected?.[0].plugins).toHaveLength(0)
  })

  test('Should detect Next.js plugin for Next.js if when Node version >= 10.13.0', async ({ fs, cwd }) => {
    const detected = await new Project(fs, cwd).setEnvironment({ NODE_VERSION: '18.x' }).detectFrameworks()
    expect(detected?.[0].id).toBe('next')
    expect(detected?.[0].plugins).toMatchObject(['@netlify/plugin-nextjs'])
  })
})

describe('Next.js Monorepo using PNPM', () => {
  beforeEach((ctx) => {
    ctx.cwd = mockFileSystem({
      'package.json': '{}',
      'pnpm-workspace.yaml': 'packages:\n - apps/*',
      'pnpm-lock.yaml': '',
      'apps/website/package.json': JSON.stringify({
        dependencies: {
          next: '10.0.5',
          react: '17.0.1',
          'react-dom': '17.0.1',
        },
      }),
    })
  })

  test('should detect Next.js from an base directory inside a monorepo', async ({ fs, cwd }) => {
    const detected = await new Project(fs, join(cwd, 'apps/website'), cwd).detectFrameworks()
    expect(detected?.[0].id).toBe('next')
  })

  test('should detect Next.js from the root of a monorepo', async ({ fs, cwd }) => {
    const detected = await new Project(fs, cwd).detectFrameworks()
    expect(detected?.[0].id).toBe('next')
  })
})
