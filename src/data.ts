import literature from './data/literature.json'
import populations from './data/populations.json'
import sites from './data/qinling-sites.json'
import manifest from './data/import-manifest.json'
import type { Literature, Population, Site } from './types'

export const literatureData = literature as Literature[]
export const populationData = populations as Population[]
export const siteData = sites as unknown as Site[]
export const importManifest = manifest

