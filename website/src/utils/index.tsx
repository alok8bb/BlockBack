export function getTruncatedWalletAddr(address: string) {
  return (
    address.substring(0, 7) + "..." + address.substring(address.length - 5)
  );
}

export function getCompletionPercentage(goal: bigint, raisedAmount: bigint) {
  const percentage = (Number(raisedAmount) / Number(goal)) * 100;
  if (percentage > 100) {
    return 100;
  } else {
    return percentage;
  }
}
