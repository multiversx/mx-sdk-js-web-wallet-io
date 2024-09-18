import { signTxSchema } from 'hooks/helpers/sign';
import { getSignHookData } from '../getSignHookData';

const schema = signTxSchema({
  isMainnet: false,
  hookWhitelist: [],
  chainId: 'D',
  isSignHook: true
});
const getData = getSignHookData(schema);
const callbackUrl = 'https://localhost:3000/';

describe('replyToDapp tests', () => {
  test('returns valid for a single transaction', () => {
    const search = `?nonce%5B0%5D=42&value%5B0%5D=1&receiver%5B0%5D=erd1uv40ahysflse896x4ktnh6ecx43u7cmy9wnxnvcyp7deg299a4sq6vaywa&sender%5B0%5D=erd1c26jzneqwlfcddqre05jh53lnmyj5n8925k0r7gcqkaphr23nnpss0j540&gasPrice%5B0%5D=1000000000&gasLimit%5B0%5D=50000&chainID%5B0%5D=D&version%5B0%5D=2&options%5B0%5D=3&guardian%5B0%5D=erd19r2ljsdzztxenqtq4wjpdpz96h555wdg059rx6unyqt74vllyudq8zh22x&signature%5B0%5D=f14d68b8fef5b135f79308ca2b468a68995150adc75f4451ad8c1991d1d1d2bec58842bf9485f890d60b3e479ec958b94554e3f1ca8f394b9658b5bf8f8c350d&callbackUrl=${callbackUrl}`;
    const data = getData(search);
    expect(data).toMatchObject({
      callbackUrl,
      hookUrl: search
    });
  });
  test('returns valid for a multiple transactions', () => {
    const search = `?nonce%5B0%5D=42&nonce%5B1%5D=43&value%5B0%5D=1&value%5B1%5D=100000000&receiver%5B0%5D=erd1uv40ahysflse896x4ktnh6ecx43u7cmy9wnxnvcyp7deg299a4sq6vaywa&receiver%5B1%5D=erd1uv40ahysflse896x4ktnh6ecx43u7cmy9wnxnvcyp7deg299a4sq6vaywa&sender%5B0%5D=erd1c26jzneqwlfcddqre05jh53lnmyj5n8925k0r7gcqkaphr23nnpss0j540&sender%5B1%5D=erd1c26jzneqwlfcddqre05jh53lnmyj5n8925k0r7gcqkaphr23nnpss0j540&gasPrice%5B0%5D=1000000000&gasPrice%5B1%5D=1000000000&gasLimit%5B0%5D=50000&gasLimit%5B1%5D=50000&data%5B1%5D=hello%20world&chainID%5B0%5D=D&chainID%5B1%5D=D&version%5B0%5D=2&version%5B1%5D=2&options%5B0%5D=3&options%5B1%5D=3&guardian%5B0%5D=erd19r2ljsdzztxenqtq4wjpdpz96h555wdg059rx6unyqt74vllyudq8zh22x&guardian%5B1%5D=erd19r2ljsdzztxenqtq4wjpdpz96h555wdg059rx6unyqt74vllyudq8zh22x&signature%5B0%5D=f14d68b8fef5b135f79308ca2b468a68995150adc75f4451ad8c1991d1d1d2bec58842bf9485f890d60b3e479ec958b94554e3f1ca8f394b9658b5bf8f8c350d&signature%5B1%5D=b3b39beea6b2a888506cef3c9319a2458b9b25b416283cefe87e9c6eea06fedb14d6fc0bbbfef5ea30d30c73d7b09339cbdad87238b69b269c36d0a680dba40b&callbackUrl=${callbackUrl}`;
    const data = getData(search);
    expect(data).toMatchObject({
      callbackUrl,
      hookUrl: search
    });
  });
});
