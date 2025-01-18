/**
 A naive-but-simple HTML escape function. It won't mangle HTML entities like `&quot;` or `&amp;` but beyond that it has no notable features.
 */
export const escapeHTML = <T>(text: T): T =>
{
  if (typeof text !== 'string')
  {
    return text;
  }

  return text.replace(/&(?![#a-zA-Z\d]+;)|[<>"']/g, (char) =>
  {
    switch (char)
    {
      case '&':
        return '&amp;';
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      case '"':
        return '&quot;';
      case "'":
        return '&#39;';
      default:
        return char;
    }
  }) as T;
};
