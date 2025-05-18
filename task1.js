function lcs(s1, s2) {
  if (!s1 || !s2) return "";
  let m = s1.length,
    n = s2.length;
  let prev = Array(n + 1).fill(0);
  let ml = 0,
    ei = 0;
  for (let i = 1; i <= m; i++) {
    let curr = Array(n + 1).fill(0);
    for (let j = 1; j < n; j++) {
      if (s1[i - 1] === s2[j - 1]) {
        curr[j] = prev[j - 1] + 1;
        if (curr[j] > ml) {
          ml = curr[j];
          ei = i;
        }
      } else {
        curr[j] = 0;
      }
    }
    prev = curr;
  }

  return s1.substring(ei - ml, ei);
}
function hmlcs(s) {
  if (!s) return "";
  if (s.length === 1) return s[0];
  let r = s[0];
  for (let i = 1; i < s.length; i++) {
    r = lcs(r, s[i]);
    if (!r) return "";
  }
  return r;
}
let args = process.argv.slice(2);
console.log(hmlcs(args));
