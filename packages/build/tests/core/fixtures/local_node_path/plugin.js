import { execPath, env } from 'process'

export const onPreBuild = function () {
  console.log(`expect execPath to equal TEST_NODE_PATH. Got '${execPath === env.TEST_NODE_PATH}'`)
}
