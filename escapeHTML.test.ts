import { expect } from '@std/expect';
import { describe, it } from '@std/testing/bdd';
import { escapeHTML } from './escapeHTML.ts';

describe('escapeHTML', () =>
{
  it('should escape weird characters in strings but not mangle HTML entities', () =>
  {
    expect(escapeHTML('<div>&quot;</div>')).toBe('&lt;div&gt;&quot;&lt;/div&gt;');
    expect(escapeHTML("Hello & 'World'")).toBe('Hello &amp; &#39;World&#39;');
    expect(escapeHTML('Test "quotes"')).toBe('Test &quot;quotes&quot;');
  });

  it('should handle empty strings', () =>
  {
    expect(escapeHTML('')).toBe('');
  });

  it('should return non-string values unchanged', () =>
  {
    expect(escapeHTML(42)).toBe(42);
    expect(escapeHTML(null)).toBe(null);
    expect(escapeHTML(undefined)).toBe(undefined);
    expect(escapeHTML(true)).toBe(true);
    expect(escapeHTML({ test: 'value' })).toEqual({ test: 'value' });
    expect(escapeHTML(['test'])).toEqual(['test']);
  });

  it('should handle strings with no weird characters', () =>
  {
    expect(escapeHTML('Hello World')).toBe('Hello World');
    expect(escapeHTML('12345')).toBe('12345');
  });

  it('should escape multiple occurrences of weird characters', () =>
  {
    expect(escapeHTML('<<>>&&&')).toBe('&lt;&lt;&gt;&gt;&amp;&amp;&amp;');
  });

  it('should escape & to &amp;', () =>
  {
    expect(escapeHTML('&')).toBe('&amp;');
  });

  it('should escape < to &lt;', () =>
  {
    expect(escapeHTML('<')).toBe('&lt;');
  });

  it('should escape > to &gt;', () =>
  {
    expect(escapeHTML('>')).toBe('&gt;');
  });

  it('should escape " to &quot;', () =>
  {
    expect(escapeHTML('"')).toBe('&quot;');
  });

  it("should escape ' to &#39;", () =>
  {
    expect(escapeHTML("'")).toBe('&#39;');
  });

  it('should escape a string with multiple weird characters', () =>
  {
    const unsafeString = `<script>alert('XSS')</script>`;
    const escapedString = '&lt;script&gt;alert(&#39;XSS&#39;)&lt;/script&gt;';
    expect(escapeHTML(unsafeString)).toBe(escapedString);
  });

  it('should return the same string if there are no weird characters', () =>
  {
    const safeString = 'Hello, World!';
    expect(escapeHTML(safeString)).toBe(safeString);
  });

  it('should return an empty string as-is', () =>
  {
    expect(escapeHTML('')).toBe('');
  });

  it('should return undefined as-is', () =>
  {
    expect(escapeHTML(undefined)).toBe(undefined);
  });

  it('should return null as-is', () =>
  {
    expect(escapeHTML(null)).toBe(null);
  });

  it('should return a number as-is', () =>
  {
    expect(escapeHTML(123)).toBe(123);
  });

  it('should return an object as-is', () =>
  {
    const obj = { key: 'value' };
    expect(escapeHTML(obj)).toBe(obj);
  });

  it('should return an array as-is', () =>
  {
    const arr = [1, 2, 3];
    expect(escapeHTML(arr)).toBe(arr);
  });
});
