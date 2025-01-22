import { build } from 'vite'
import { resolve } from 'path'
import fs from 'fs-extra'

async function buildExtension() {
  try {
    // Build the main application
    await build()

    // Copy static files
    await fs.copy('public', 'dist', {
      filter: (src) => {
        // Don't copy index.html as it's handled by Vite
        return !src.endsWith('index.html')
      }
    })

    // Copy manifest.json
    await fs.copy('public/manifest.json', 'dist/manifest.json')

    console.log('Build completed successfully!')
  } catch (error) {
    console.error('Build failed:', error)
    process.exit(1)
  }
}

buildExtension() 