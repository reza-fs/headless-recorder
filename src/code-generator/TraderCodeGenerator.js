import pptrActions from './pptr-actions'
import Block from './Block'
import CodeGenerator from './CodeGenerator'

const importPlaywright = ``

const header = `const {setUp, tearDown, mobile_viewport, desktop_viewport} = require('@root/bootstrap');
const Trader = require('@root/objects/trader');
const {replaceWebsocket} = require("@root/_utils/websocket");

let browser, context, page;

describe('TEST_COLLECTION', () => {
  beforeAll(async () => {
        const out = await setUp(desktop_viewport);
        browser = out.browser;
        context = out.context;
        await context.addInitScript(replaceWebsocket);
        page = new Trader(await context.newPage());
        await page.navigate();
        await page.loadOrLogin(process.env.VALID_USER, process.env.VALID_PASSWORD);
        await page.switchVirtualAccount();
        await page.waitForAccountInfoDropdown();
        await page.chooseUnderlying('1HZ10V', 'Volatility 10 (1s) Index');
    });

    afterEach(async () => {
        await page.clearTradeUIArtifacts();
    });

    afterAll(async () => {
        await tearDown(browser);
    });

    test('[desktop] TEST_COLLECTION TEST_CASE', async () => {
`

const footer = `
});`

const wrappedHeader = header

const wrappedFooter = `
})`

export default class TraderCodeGenerator extends CodeGenerator {
  constructor (options) {
    super(options)
    this._header = header
    this._wrappedHeader = wrappedHeader
    this._footer = footer
    this._wrappedFooter = wrappedFooter
  }

  generate (events) {
    return importPlaywright + this._getHeader() + this._parseEvents(events) + this._getFooter()
  }

  _handleViewport (width, height) {
    return new Block(this._frameId, { type: pptrActions.VIEWPORT, value: `await ${this._frame}.setViewportSize({ width: ${width}, height: ${height} })` })
  }

  _handleChange (selector, value) {
    return new Block(this._frameId, { type: pptrActions.CHANGE, value: `await ${this._frame}.selectOption('${selector}', '${value}')` })
  }
}
