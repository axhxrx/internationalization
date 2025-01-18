import { expect } from '@std/expect';
import { describe, it } from '@std/testing/bdd';
import { interpolate } from './interpolate.ts';
import type { LocalizedUnit } from './LocalizedUnit.ts';

describe('interpolate()', () =>
{
  const mockUnit: LocalizedUnit<'en' | 'ja'> = {
    en: 'Hello {{name}}',
    ja: 'こんにちは {{name}}',
  };

  it('should interpolate basic parameters', () =>
  {
    const actual = interpolate('Hello {{name}}', mockUnit, 'en', { name: 'Alice' });
    expect(actual).toBe('Hello Alice');
  });

  it('should handle multiple parameters', () =>
  {
    const actual = interpolate(
      'Hello {{firstName}} {{lastName}}',
      mockUnit,
      'en',
      { firstName: 'Alice', lastName: 'Smith' },
    );
    expect(actual).toBe('Hello Alice Smith');
  });

  it('should handle missing parameters', () =>
  {
    const actual = interpolate('Hello {{name}}', mockUnit, 'en', {});
    expect(actual).toBe('Hello ');
  });

  it('should handle null/undefined message', () =>
  {
    const actualNull = interpolate(null, mockUnit, 'en', { name: 'Alice' });
    expect(actualNull).toBe('');

    const actualUndefined = interpolate(undefined, mockUnit, 'en', { name: 'Alice' });
    expect(actualUndefined).toBe('');
  });

  it('should handle HTML escaping', () =>
  {
    const actual = interpolate(
      'Message: {{message}}',
      mockUnit,
      'en',
      { message: '<script>alert("xss")</script>' },
      true,
    );
    expect(actual).toBe('Message: &lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;');
  });

  it('should not escape HTML when escapeParam is false', () =>
  {
    const actual = interpolate(
      'Message: {{message}}',
      mockUnit,
      'en',
      { message: '<b>bold</b>' },
      false,
    );
    expect(actual).toBe('Message: <b>bold</b>');
  });
});
