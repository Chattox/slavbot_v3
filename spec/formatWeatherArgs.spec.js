const { expect } = require('chai');
const { formatWeatherArgs } = require('../utils/formatWeatherArgs');

describe('formatWeatherArgs', () => {
  describe('functionality', () => {
    it('takes an array and returns a string', () => {
      const input = ['southport'];
      const actual = formatWeatherArgs(input);

      expect(actual).to.be.a('string');
    });
    it('returns formatted string when given array with single element', () => {
      const input = ['southport'];
      const actual = formatWeatherArgs(input);
      const expected = 'southport';

      expect(actual).to.eql(expected);
    });
    it('returns formatted string when given array with multiple elements', () => {
      const input = ['southport', 'uk'];
      const actual = formatWeatherArgs(input);
      const expected = 'southport,uk';

      expect(actual).to.eql(expected);
    });
    it('removes non-alphabetical characters', () => {
      const input = ['sou.th,port', 'uk10'];
      const actual = formatWeatherArgs(input);
      const expected = 'southport,uk';

      expect(actual).to.eql(expected);
    });
  });

  describe('error handling', () => {
    it('returns false when argument undefined', () => {
      const input = undefined;
      const actual = formatWeatherArgs(input);

      expect(actual).to.be.false;
    });
  });
});
