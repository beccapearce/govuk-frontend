import { join } from 'path'

import { paths } from 'govuk-frontend-config'
import puppeteer from 'puppeteer'

/**
 * Puppeteer browser downloader
 */
export async function download () {
  const fetcher = puppeteer.createBrowserFetcher({
    path: join(paths.root, '.cache', 'puppeteer/chrome')
  })

  // Downloaded versions
  // @ts-expect-error 'defaultBrowserRevision' is marked @internal
  const latest = puppeteer.defaultBrowserRevision
  const versions = fetcher.localRevisions()

  // Download latest browser (unless cached)
  if (!versions.includes(latest)) {
    await fetcher.download(latest)

    // Remove outdated browser versions
    for (const version of versions) {
      await fetcher.remove(version)
    }
  }
}
