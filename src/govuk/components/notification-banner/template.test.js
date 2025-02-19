const cheerio = require('cheerio')
const { render } = require('govuk-frontend-helpers/nunjucks')
const { axe } = require('govuk-frontend-helpers/tests')
const { getExamples } = require('govuk-frontend-lib/files')

describe('Notification-banner', () => {
  let examples

  beforeAll(async () => {
    examples = await getExamples('notification-banner')
  })

  describe('default example', () => {
    it('passes accessibility tests', async () => {
      const $ = cheerio.load(render('notification-banner', examples.default))

      const results = await axe($.html())
      expect(results).toHaveNoViolations()
    })

    it('aria-labelledby attribute matches the title id', () => {
      const $ = cheerio.load(render('notification-banner', examples.default))
      const ariaAttr = $('.govuk-notification-banner').attr('aria-labelledby')
      const titleId = $('.govuk-notification-banner__title').attr('id')

      expect(ariaAttr).toEqual(titleId)
    })

    it('has role=region attribute', () => {
      const $ = cheerio.load(render('notification-banner', examples.default))
      const $component = $('.govuk-notification-banner')

      expect($component.attr('role')).toEqual('region')
    })

    it('has data-module attribute to initialise JavaScript', () => {
      const $ = cheerio.load(render('notification-banner', examples.default))
      const $component = $('.govuk-notification-banner')

      expect($component.attr('data-module')).toEqual('govuk-notification-banner')
    })

    it('renders header container', () => {
      const $ = cheerio.load(render('notification-banner', examples.default))
      const $header = $('.govuk-notification-banner__header')

      expect($header.length).toBeTruthy()
    })

    it('renders default heading level', () => {
      const $ = cheerio.load(render('notification-banner', examples.default))
      const $title = $('.govuk-notification-banner__title')

      expect($title.get(0).tagName).toEqual('h2')
    })

    it('renders default title text', () => {
      const $ = cheerio.load(render('notification-banner', examples.default))
      const $title = $('.govuk-notification-banner__title')

      expect($title.html().trim()).toEqual('Important')
    })

    it('renders content', () => {
      const $ = cheerio.load(render('notification-banner', examples.default))
      const $content = $('.govuk-notification-banner__heading')

      expect($content.html().trim()).toEqual('This publication was withdrawn on 7 March 2014.')
    })
  })

  describe('custom options', () => {
    it('renders custom title', () => {
      const $ = cheerio.load(render('notification-banner', examples['custom title']))
      const $title = $('.govuk-notification-banner__title')

      expect($title.html().trim()).toEqual('Important information')
    })

    it('renders custom content', () => {
      const $ = cheerio.load(render('notification-banner', examples['custom text']))
      const $content = $('.govuk-notification-banner__heading')

      expect($content.html().trim()).toEqual('This publication was withdrawn on 7 March 2014.')
    })

    it('renders custom heading level', () => {
      const $ = cheerio.load(render('notification-banner', examples['custom title heading level']))
      const $title = $('.govuk-notification-banner__title')

      expect($title.get(0).tagName).toEqual('h3')
    })

    it('renders custom role', () => {
      const $ = cheerio.load(render('notification-banner', examples['custom role']))
      const $component = $('.govuk-notification-banner')

      expect($component.attr('role')).toEqual('banner')
    })

    it('renders aria-labelledby attribute matching the title id when role overridden to region', () => {
      const $ = cheerio.load(render('notification-banner', examples['role=alert overridden to role=region, with type as success']))
      const ariaAttr = $('.govuk-notification-banner').attr('aria-labelledby')
      const titleId = $('.govuk-notification-banner__title').attr('id')

      expect(ariaAttr).toEqual(titleId)
    })

    it('renders custom title id', () => {
      const $ = cheerio.load(render('notification-banner', examples['custom title id']))
      const $title = $('.govuk-notification-banner__title')

      expect($title.attr('id')).toEqual('my-id')
    })

    it('has an aria-labelledby attribute matching the title id', () => {
      const $ = cheerio.load(render('notification-banner', examples['custom title id']))
      const ariaAttr = $('.govuk-notification-banner').attr('aria-labelledby')

      expect(ariaAttr).toEqual('my-id')
    })

    it('adds data-disable-auto-focus="true" if disableAutoFocus is true', () => {
      const $ = cheerio.load(render('notification-banner', examples['auto-focus disabled, with type as success']))

      const $component = $('.govuk-notification-banner')
      expect($component.attr('data-disable-auto-focus')).toBe('true')
    })

    it('adds data-disable-auto-focus="false" if disableAutoFocus is false', () => {
      const $ = cheerio.load(render('notification-banner', examples['auto-focus explicitly enabled, with type as success']))

      const $component = $('.govuk-notification-banner')
      expect($component.attr('data-disable-auto-focus')).toBe('false')
    })

    it('renders classes', () => {
      const $ = cheerio.load(render('notification-banner', examples.classes))

      const $component = $('.govuk-notification-banner')
      expect($component.hasClass('app-my-class')).toBeTruthy()
    })

    it('renders attributes', () => {
      const $ = cheerio.load(render('notification-banner', examples.attributes))

      const $component = $('.govuk-notification-banner')
      expect($component.attr('my-attribute')).toEqual('value')
    })
  })

  describe('html', () => {
    it('renders title as escaped html when passed as text', () => {
      const $ = cheerio.load(render('notification-banner', examples['title html as text']))
      const $title = $('.govuk-notification-banner__title')

      expect($title.html().trim()).toEqual('&lt;span&gt;Important information&lt;/span&gt;')
    })

    it('renders nested components using `call`', () => {
      const $ = cheerio.load(render('notification-banner', {}, '<div class="app-nested-component"></div>'))

      expect($('.govuk-notification-banner .app-nested-component').length).toBeTruthy()
    })

    it('renders title as html', () => {
      const $ = cheerio.load(render('notification-banner', examples['title as html']))
      const $title = $('.govuk-notification-banner__title')

      expect($title.html().trim()).toEqual('<span>Important information</span>')
    })

    it('renders content as escaped html when passed as text', () => {
      const $ = cheerio.load(render('notification-banner', examples['html as text']))
      const $content = $('.govuk-notification-banner__content')

      expect($content.html().trim()).toEqual('<p class="govuk-notification-banner__heading">&lt;span&gt;This publication was withdrawn on 7 March 2014.&lt;/span&gt;</p>')
    })

    it('renders content as html', () => {
      const $ = cheerio.load(render('notification-banner', examples['with text as html']))
      const $contentHtml = $('.govuk-notification-banner__content')

      expect($contentHtml.html().trim()).toEqual('<h3 class="govuk-notification-banner__heading">This publication was withdrawn on 7 March 2014</h3><p class="govuk-body">Archived and replaced by the <a href="#" class="govuk-notification-banner__link">new planning guidance</a> launched 6 March 2014 on an external website</p>')
    })
  })

  describe('when success type is passed', () => {
    it('renders with appropriate class', () => {
      const $ = cheerio.load(render('notification-banner', examples['with type as success']))

      const $component = $('.govuk-notification-banner')
      expect($component.hasClass('govuk-notification-banner--success')).toBeTruthy()
    })

    it('has role=alert attribute', () => {
      const $ = cheerio.load(render('notification-banner', examples['with type as success']))

      const $component = $('.govuk-notification-banner')
      expect($component.attr('role')).toEqual('alert')
    })

    it('does render aria-labelledby', () => {
      const $ = cheerio.load(render('notification-banner', examples['with type as success']))
      const $component = $('.govuk-notification-banner')

      expect($component.attr('aria-labelledby')).toEqual('govuk-notification-banner-title')
    })

    it('renders a title id for aria-labelledby', () => {
      const $ = cheerio.load(render('notification-banner', examples['with type as success']))
      const $component = $('.govuk-notification-banner__title')

      expect($component.attr('id')).toEqual('govuk-notification-banner-title')
    })

    it('renders default success title text', () => {
      const $ = cheerio.load(render('notification-banner', examples['with type as success']))
      const $title = $('.govuk-notification-banner__title')

      expect($title.html().trim()).toEqual('Success')
    })

    it('renders custom title id and aria-labelledby', () => {
      const $ = cheerio.load(render('notification-banner', examples['custom title id with type as success']))
      const $component = $('.govuk-notification-banner')
      const $title = $('.govuk-notification-banner__title')

      expect($component.attr('aria-labelledby')).toEqual('my-id')
      expect($title.attr('id')).toEqual('my-id')
    })
  })

  describe('when type that is invalid is passed', () => {
    it('has role=region attribute', () => {
      const $ = cheerio.load(render('notification-banner', examples['with invalid type']))
      const $component = $('.govuk-notification-banner')

      expect($component.attr('role')).toEqual('region')
    })

    it('aria-labelledby attribute matches the title id', () => {
      const $ = cheerio.load(render('notification-banner', examples['with invalid type']))
      const ariaAttr = $('.govuk-notification-banner').attr('aria-labelledby')
      const titleId = $('.govuk-notification-banner__title').attr('id')

      expect(ariaAttr).toEqual(titleId)
    })
  })
})
