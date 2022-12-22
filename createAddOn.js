import { readFile } from '@sanjo/read-file'
import { writeFile } from '@sanjo/write-file'
import { mkdir } from 'node:fs/promises'
import { basename, dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const directoryPath = dirname(fileURLToPath(import.meta.url))

export async function createAddOn(addOnPath) {
  const addOnName = basename(addOnPath)
  const title = generateTitle(addOnName)

  await mkdir(addOnPath, {
    recursive: true,
  })

  {
    const content =
      `## Title: ${ title }
## Interface: 100002

${ addOnName }.lua
`
    await writeFile(join(addOnPath, `${ addOnName }.toc`), content)
  }

  {
    const content =
      `## Title: ${ title }
## Interface: 30400

${ addOnName }.lua
`
    await writeFile(join(addOnPath, `${ addOnName }_Wrath.toc`), content)
  }

  {
    const content =
      `## Title: ${ title }
## Interface: 11403

${ addOnName }.lua
`
    await writeFile(join(addOnPath, `${ addOnName }_Vanilla.toc`), content)
  }

  {
    const content =
      `${ addOnName } = ${ addOnName } or {}
local addOnName, AddOn = ...
local _ = {}
`
    await writeFile(join(addOnPath, `${ addOnName }.lua`), content)
  }

  {
    const content = await readFile(join(directoryPath, 'data', 'LICENSE'))
    await writeFile(join(addOnPath, 'LICENSE'), content)
  }
}

function generateTitle(addOnName) {
  const words = addOnName.match(/\b.+\b/g)
  return words.map(capitalize).join(' ')
}

function capitalize(word) {
  return word[0].toUpperCase() + word.slice(1)
}
