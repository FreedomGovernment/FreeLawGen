// Copyright FreedomGovernment; license at https://github.com/FreedomGovernment/FreeLawGen

export function IssueStringNumber(input: string) {
  if (input[0] != '#') return -1
  return parseInt(input.substring(1,))
}
