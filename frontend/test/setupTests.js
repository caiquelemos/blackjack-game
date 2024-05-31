import fetchMock from "jest-fetch-mock";
import "@testing-library/jest-dom";

fetchMock.enableMocks();

global.console = {
  ...global.console,
  log: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

global.bootstrap = {
  Modal: class {
    constructor(element, config) {
      this._element = element;
      this._config = config;
    }
    show() {
      this._element.style.display = "block";
    }
    hide() {
      this._element.style.display = "none";
    }
  },
};
