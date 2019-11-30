const core = require('@actions/core')
const {issueCommand} = require('@actions/core/lib/command')
const path = require('path')
const cspell = require('cspell/dist/application')

async function run() {
  try { 
    const paths = core.getInput('paths', { required: true })
    const options = {
      config: core.getInput('config'),
      exclude: core.getInput('exclude'),
      unique: core.getInput('unique')
    }
    const emitters = {
      issue: item => {
        issueCommand("warning", {
            file: path.relative(process.cwd(), item.uri),
            line: item.row,
            col: item.col
          }, `Unknown word (${item.text})`)    
      },
      error: async message => core.error(message),
      info: () => {},
      debug: () => {}
    }

    const { files, issues, filesWithIssues } = await cspell.lint([ paths ], options, emitters)
    core.info(`Files checked: ${files}`)
    if (issues) {
      throw new Error(`${issues} issues found in ${filesWithIssues.size} file(s)`)
    }
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
