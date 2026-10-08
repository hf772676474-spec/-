import { defineConfig } from 'vite'

const configuredBase = process.env.VITE_BASE_PATH ?? '/'
const base =
  configuredBase === '/'
    ? '/'
    : `/${configuredBase.replace(/^\/+|\/+$/g, '')}/`

export default defineConfig({
  base,
})

