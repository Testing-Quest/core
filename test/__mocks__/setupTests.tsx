import '@testing-library/jest-dom'

jest.mock('../../src/infrastructure/react/App.module.css', () => ({}))

jest.mock('../../src/infrastructure/react/tabs/analysis/AnalysisTab.module.css', () => ({}))

jest.mock('../../src/infrastructure/react/tabs/analysis/components/Components.module.css', () => ({}))

/* eslint-disable @typescript-eslint/no-explicit-any */
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
