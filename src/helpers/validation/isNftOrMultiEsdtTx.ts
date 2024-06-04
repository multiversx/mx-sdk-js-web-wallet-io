enum TransferDataEnum {
  ESDTNFTTransfer = 'ESDTNFTTransfer',
  ESDTNFTCreate = 'ESDTNFTCreate',
  ESDTNFTBurn = 'ESDTNFTBurn',
  MultiESDTNFTTransfer = 'MultiESDTNFTTransfer'
}

export const isNftOrMultiEsdtTx = (data: string) =>
  Object.values(TransferDataEnum).some((value) => data.startsWith(value));
