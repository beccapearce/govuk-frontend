const { join } = require('path')

const configPaths = require('../../../config/paths')
const { getListing } = require('../../../lib/file-helper')
const { compileSassFile } = require('../../../lib/jest-helpers')

describe('Components', () => {
  let sassFiles

  beforeAll(async () => {
    sassFiles = await getListing(join(configPaths.src, 'govuk/components'), '**/*.scss', {
      ignore: [
        '**/_all.scss',
        '**/_index.scss'
      ]
    })
  })

  describe('Sass render', () => {
    it('renders CSS for all components', () => {
      const file = join(configPaths.src, 'govuk/components/_all.scss')

      return expect(compileSassFile(file)).resolves.toMatchObject({
        css: expect.any(String),
        loadedUrls: expect.arrayContaining([expect.any(URL)])
      })
    })

    it('renders CSS for each component', () => {
      const sassTasks = sassFiles.map((sassFilePath) => {
        const file = join(configPaths.src, 'govuk/components', sassFilePath)

        return expect(compileSassFile(file)).resolves.toMatchObject({
          css: expect.any(String),
          loadedUrls: expect.arrayContaining([expect.any(URL)])
        })
      })

      return Promise.all(sassTasks)
    })
  })
})
