const args = process.argv.slice(2);
function lcs(s1, s2) {
  if (!s1 || !s2) return "";
  [s1, s2] = [s1, s2].sort((a, b) => a.length - b.length);
  const [shorter, longer] = [s1, s2];

  for (let len = shorter.length; len > 0; len--) {
    for (let start = 0; start <= shorter.length - len; start++) {
      const substr = shorter.slice(start, start + len);
      if (longer.includes(substr)) return substr;
    }
  }
  return "";
}
console.log(args.reduce((acc, curr) => lcs(acc, curr), args[0] || ""));
