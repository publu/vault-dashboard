export function shortenHex(hexString: string, chars = 4): string {
  return `${hexString.substring(0, chars + 2)}...${hexString.substring(
    hexString.length - chars
  )}`;
}
