/**
 * Tests for the new ModernDOM utilities
 * These tests ensure our modern replacements work correctly
 */

import { 
  $, $$, createElement, addClass, removeClass, toggleClass, hasClass,
  setStyle, getStyle, on, off, once, append, prepend, remove, empty,
  show, hide, toggle, getPosition, setPosition, fetchJSON, fetchText,
  getJSON, ajax, ready, isElement
} from '../../src/js/dom/ModernDOM.js';

// Mock fetch for testing
global.fetch = jest.fn();

describe('ModernDOM Query Selectors', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="test-container">
        <div class="test-item">Item 1</div>
        <div class="test-item">Item 2</div>
        <span class="test-span">Span</span>
      </div>
    `;
  });

  test('$ should select single element', () => {
    const element = $('#test-container');
    expect(element).toBeTruthy();
    expect(element.id).toBe('test-container');
  });

  test('$$ should select multiple elements', () => {
    const elements = $$('.test-item');
    expect(elements).toHaveLength(2);
    expect(elements[0].textContent).toBe('Item 1');
    expect(elements[1].textContent).toBe('Item 2');
  });

  test('$ should return element if already an element', () => {
    const div = document.createElement('div');
    const result = $(div);
    expect(result).toBe(div);
  });
});

describe('ModernDOM Element Creation', () => {
  test('createElement should create element with options', () => {
    const element = createElement('div', {
      className: 'test-class',
      id: 'test-id',
      textContent: 'Test content',
      attributes: { 'data-test': 'value' },
      styles: { color: 'red', fontSize: '16px' }
    });

    expect(element.tagName).toBe('DIV');
    expect(element.className).toBe('test-class');
    expect(element.id).toBe('test-id');
    expect(element.textContent).toBe('Test content');
    expect(element.getAttribute('data-test')).toBe('value');
    expect(element.style.color).toBe('red');
    expect(element.style.fontSize).toBe('16px');
  });

  test('createElement should append to parent if specified', () => {
    const parent = document.createElement('div');
    const child = createElement('span', { parent });
    
    expect(parent.children).toHaveLength(1);
    expect(parent.children[0]).toBe(child);
  });
});

describe('ModernDOM Class Manipulation', () => {
  let element;

  beforeEach(() => {
    element = document.createElement('div');
  });

  test('addClass should add class', () => {
    addClass(element, 'test-class');
    expect(element.classList.contains('test-class')).toBe(true);
  });

  test('removeClass should remove class', () => {
    element.classList.add('test-class');
    removeClass(element, 'test-class');
    expect(element.classList.contains('test-class')).toBe(false);
  });

  test('toggleClass should toggle class', () => {
    toggleClass(element, 'test-class');
    expect(element.classList.contains('test-class')).toBe(true);
    
    toggleClass(element, 'test-class');
    expect(element.classList.contains('test-class')).toBe(false);
  });

  test('hasClass should check for class', () => {
    element.classList.add('test-class');
    expect(hasClass(element, 'test-class')).toBe(true);
    expect(hasClass(element, 'other-class')).toBe(false);
  });
});

describe('ModernDOM Style Utilities', () => {
  let element;

  beforeEach(() => {
    element = document.createElement('div');
    document.body.appendChild(element);
  });

  afterEach(() => {
    document.body.removeChild(element);
  });

  test('setStyle should set single style', () => {
    setStyle(element, 'color', 'red');
    expect(element.style.color).toBe('red');
  });

  test('setStyle should set multiple styles', () => {
    setStyle(element, { color: 'red', fontSize: '16px' });
    expect(element.style.color).toBe('red');
    expect(element.style.fontSize).toBe('16px');
  });
});

describe('ModernDOM Event Handling', () => {
  let element;

  beforeEach(() => {
    element = document.createElement('div');
  });

  test('on should add event listener', () => {
    const handler = jest.fn();
    on(element, 'click', handler);
    
    element.click();
    expect(handler).toHaveBeenCalled();
  });

  test('off should remove event listener', () => {
    const handler = jest.fn();
    on(element, 'click', handler);
    off(element, 'click', handler);
    
    element.click();
    expect(handler).not.toHaveBeenCalled();
  });

  test('once should fire only once', () => {
    const handler = jest.fn();
    once(element, 'click', handler);
    
    element.click();
    element.click();
    expect(handler).toHaveBeenCalledTimes(1);
  });
});

describe('ModernDOM Manipulation', () => {
  let parent;

  beforeEach(() => {
    parent = document.createElement('div');
  });

  test('append should add child element', () => {
    const child = document.createElement('span');
    append(parent, child);
    
    expect(parent.children).toHaveLength(1);
    expect(parent.children[0]).toBe(child);
  });

  test('append should add HTML string', () => {
    append(parent, '<span>Test</span>');
    
    expect(parent.children).toHaveLength(1);
    expect(parent.children[0].textContent).toBe('Test');
  });

  test('empty should clear content', () => {
    parent.innerHTML = '<span>Test</span>';
    empty(parent);
    
    expect(parent.innerHTML).toBe('');
  });
});

describe('ModernDOM Network Utilities', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test('fetchJSON should fetch and parse JSON', async () => {
    const mockData = { test: 'data' };
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData
    });

    const result = await fetchJSON('test-url');
    expect(result).toEqual(mockData);
    expect(fetch).toHaveBeenCalledWith('test-url', expect.any(Object));
  });

  test('getJSON should work with callback', (done) => {
    const mockData = { test: 'data' };
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData
    });

    getJSON('test-url', (data) => {
      expect(data).toEqual(mockData);
      done();
    });
  });

  test('ajax should handle POST requests', () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true })
    });

    ajax({
      url: 'test-url',
      method: 'POST',
      data: { test: 'data' },
      success: jest.fn()
    });

    expect(fetch).toHaveBeenCalledWith('test-url', expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({ test: 'data' })
    }));
  });
});

describe('ModernDOM Utility Functions', () => {
  test('isElement should identify elements', () => {
    const div = document.createElement('div');
    const text = document.createTextNode('text');
    const obj = {};

    expect(isElement(div)).toBe(true);
    expect(isElement(document)).toBe(true);
    expect(isElement(text)).toBe(false);
    expect(isElement(obj)).toBe(false);
  });

  test('ready should execute callback when DOM is ready', (done) => {
    // Mock document.readyState
    Object.defineProperty(document, 'readyState', {
      value: 'complete',
      writable: true
    });

    ready(() => {
      expect(true).toBe(true);
      done();
    });
  });
});
