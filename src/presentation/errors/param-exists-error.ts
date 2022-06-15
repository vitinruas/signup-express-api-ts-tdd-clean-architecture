export class ParamAlreadyExistsError extends Error {
  constructor(paramName: string) {
    super(`Param Already Exists: ${paramName}`)
    this.name = 'ParamAlreadyExistsError'
  }
}
