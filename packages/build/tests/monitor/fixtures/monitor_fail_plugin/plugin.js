export const onPreBuild = function ({
  utils: {
    build: { failPlugin },
  },
}) {
  failPlugin('test')
}
