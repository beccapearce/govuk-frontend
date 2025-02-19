const cheerio = require('cheerio')
const { render } = require('govuk-frontend-helpers/nunjucks')
const { axe } = require('govuk-frontend-helpers/tests')
const { getExamples } = require('govuk-frontend-lib/files')

describe('Tabs', () => {
  let examples

  beforeAll(async () => {
    examples = await getExamples('tabs')
  })

  describe('default example', () => {
    it('passes accessibility tests', async () => {
      const $ = cheerio.load(render('tabs', examples.default))

      const results = await axe($.html())
      expect(results).toHaveNoViolations()
    })

    it('renders the first tab selected', () => {
      const $ = cheerio.load(render('tabs', examples.default))

      const $tab = $('[href="#past-day"]').parent()
      expect($tab.hasClass('govuk-tabs__list-item--selected')).toBeTruthy()
    })

    it('hides all but the first panel', () => {
      const $ = cheerio.load(render('tabs', examples.default))

      expect($('#past-week').hasClass('govuk-tabs__panel--hidden')).toBeTruthy()
      expect($('#past-month').hasClass('govuk-tabs__panel--hidden')).toBeTruthy()
      expect($('#past-year').hasClass('govuk-tabs__panel--hidden')).toBeTruthy()
    })
  })

  describe('custom options', () => {
    it('renders with classes', () => {
      const $ = cheerio.load(render('tabs', examples.classes))

      const $component = $('.govuk-tabs')
      expect($component.hasClass('app-tabs--custom-modifier')).toBeTruthy()
    })

    it('renders with id', () => {
      const $ = cheerio.load(render('tabs', examples.id))

      const $component = $('.govuk-tabs')
      expect($component.attr('id')).toEqual('my-tabs')
    })

    it('allows custom title text to be passed', () => {
      const $ = cheerio.load(render('tabs', examples.title))

      const content = $('.govuk-tabs__title').html().trim()
      expect(content).toEqual('Custom title for Contents')
    })

    it('renders with attributes', () => {
      const $ = cheerio.load(render('tabs', examples.attributes))

      const $component = $('.govuk-tabs')
      expect($component.attr('data-attribute')).toEqual('my data value')
    })
  })

  describe('items', () => {
    it('doesn\'t render a list if items is not defined', () => {
      const $ = cheerio.load(render('tabs', examples['no item list']))

      const $component = $('.govuk-tabs')
      expect($component.find('.govuk-tabs__list').length).toEqual(0)
    })

    it('doesn\'t render a list if items is empty', () => {
      const $ = cheerio.load(render('tabs', examples['empty item list']))

      const $component = $('.govuk-tabs')
      expect($component.find('.govuk-tabs__list').length).toEqual(0)
    })

    it('render a matching tab and panel using item id', () => {
      const $ = cheerio.load(render('tabs', examples.default))

      const $component = $('.govuk-tabs')

      const $firstTab = $component.find('.govuk-tabs__list-item:first-child .govuk-tabs__tab')
      const $firstPanel = $component.find('.govuk-tabs__panel')
      expect($firstTab.attr('href')).toEqual('#past-day')
      expect($firstPanel.attr('id')).toEqual('past-day')
    })

    it('render without falsey values', () => {
      const $ = cheerio.load(render('tabs', examples['with falsey values']))

      const $component = $('.govuk-tabs')

      const $items = $component.find('.govuk-tabs__list-item')
      expect($items.length).toEqual(2)
    })

    it('render a matching tab and panel using custom idPrefix', () => {
      const $ = cheerio.load(render('tabs', examples.idPrefix))

      const $component = $('.govuk-tabs')

      const $firstTab = $component.find('.govuk-tabs__list-item:first-child .govuk-tabs__tab')
      const $firstPanel = $component.find('.govuk-tabs__panel')
      expect($firstTab.attr('href')).toEqual('#custom-1')
      expect($firstPanel.attr('id')).toEqual('custom-1')
    })

    it('render the label', () => {
      const $ = cheerio.load(render('tabs', examples.default))

      const $component = $('.govuk-tabs')

      const $firstTab = $component.find('.govuk-tabs__list-item:first-child .govuk-tabs__tab')
      expect($firstTab.text().trim()).toEqual('Past day')
    })

    it('render with panel content as text, wrapped in styled paragraph', () => {
      const $ = cheerio.load(render('tabs', examples.default))
      const $component = $('.govuk-tabs')
      const $lastTab = $component.find('.govuk-tabs__panel').last()

      expect($lastTab.find('p').hasClass('govuk-body')).toBeTruthy()
      expect($lastTab.text().trim()).toEqual('There is no data for this year yet, check back later')
    })

    it('render escaped html when passed to text content', () => {
      const $ = cheerio.load(render('tabs', examples['html as text']))

      const $component = $('.govuk-tabs')

      const $firstPanel = $component.find('.govuk-tabs__panel .govuk-body')
      expect($firstPanel.html().trim()).toEqual('&lt;p&gt;Panel 1 content&lt;/p&gt;')
    })

    it('render html when passed to content', () => {
      const $ = cheerio.load(render('tabs', examples.html))

      const $component = $('.govuk-tabs')

      const $firstPanel = $component.find('.govuk-tabs__panel')
      expect($firstPanel.html().trim()).toEqual('<p>Panel 1 content</p>')
    })

    it('render a tab anchor with attributes', () => {
      const $ = cheerio.load(render('tabs', examples['item with attributes']))

      const $tabItemLink = $('.govuk-tabs__tab')
      expect($tabItemLink.attr('data-attribute')).toEqual('my-attribute')
      expect($tabItemLink.attr('data-attribute-2')).toEqual('my-attribute-2')
    })

    it('render a tab panel with attributes', () => {
      const $ = cheerio.load(render('tabs', examples['panel with attributes']))

      const $tabPanelItems = $('.govuk-tabs__panel')
      expect($tabPanelItems.attr('data-attribute')).toEqual('my-attribute')
      expect($tabPanelItems.attr('data-attribute-2')).toEqual('my-attribute-2')
    })
  })
})
