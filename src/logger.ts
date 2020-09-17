import colors from 'colors/safe'

class Logger {
  debug: boolean;

  constructor (debug: boolean = false) {
    this.debug = debug
  }

  log (message: any) {
    if (this.debug) {
      console.log(message)
    }
  }

  info (message: any) {
    if (this.debug) {
      console.log(colors.cyan(message))
    }
  }

  error (message: any) {
    if (this.debug) {
      console.error(colors.red(message))
    }
  }

  warn (message: any) {
    if (this.debug) {
      console.log(colors.yellow(message))
    }
  }

  setDebug (debug: boolean) {
    this.debug = debug
  }
}

export default new Logger()
