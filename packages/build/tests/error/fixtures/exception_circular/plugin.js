export const onPreBuild = function () {
  const error = new Error('test')
  error.test = true
  error.prop = null
  error.objectProp = {}
  error.objectProp.self = error.objectProp
  throw error
}
