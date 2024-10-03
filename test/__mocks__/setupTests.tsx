import '@testing-library/jest-dom'

jest.mock('../../src/infrastructure/react/App.module.css', () => ({
  appLayout: 'appLayout',
  appContent: 'appContent',
  tabsContainer: 'tabsContainer',
  tabPane: 'tabPane',
  dynamicTab: 'dynamicTab',
  tabIcon: 'tabIcon',
}))

jest.mock('../../src/infrastructure/react/tabs/analysis/Sidebar.module.css', () => ({
  sidebar: 'sidebar',
  logo: 'logo',
  menu: 'menu',
}))

jest.mock('antd', () => {
  const antd = jest.requireActual('antd')
  const MockSpin = (props: any) => <>{props.children ?? null}</>
  return { ...antd, Spin: MockSpin }
})

const mockMatchMedia = () => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  })
}

beforeEach(() => {
  mockMatchMedia()
})
