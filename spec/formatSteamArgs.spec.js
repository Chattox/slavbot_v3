const { expect } = require('chai');
const { formatSteamArgs } = require('../utils/formatSteamArgs');

describe('formatSteamArgs', () => {
  describe('functionality', () => {
    it('takes an array and returns a string', () => {
      const input = ['fear'];
      const actual = formatSteamArgs(input);

      expect(actual).to.be.a('string');
    });
    it('returns formatted string when given array with single element', () => {
      const input = ['fear'];
      const actual = formatSteamArgs(input);
      const expected = 'fear';

      expect(actual).to.eql(expected);
    });
    it('returns formatted string when given array with multiple elements', () => {
      const input = ['fear', 'is', 'the', 'mind', 'killer'];
      const actual = formatSteamArgs(input);
      const expected = 'fear is the mind killer';

      expect(actual).to.eql(expected);
    });
    it('removes non-alphabetical characters', () => {
      const input = ['fea;r', "i's", 'th3', 'm1.nd', 'k177er£^£&"&$%'];
      const actual = formatSteamArgs(input);
      const expected = 'fear is th mnd ker';

      expect(actual).to.eql(expected);
    });
  });

  describe('error handling', () => {
    it('returns false when argument undefined', () => {
      const input = undefined;
      const actual = formatSteamArgs(input);

      expect(actual).to.be.false;
    });
  });
});
