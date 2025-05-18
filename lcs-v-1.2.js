const ar=process.argv.slice(2);
function lcs(s1, s2) {if (!s1 || !s2) return "";
[s1, s2]=[s1, s2].sort((a, b) => a.length - b.length);
const [shr, lon]=[s1, s2];
for (let i=shr.length; i>0; i--) {for (let j=0; j <=shr.length-i; j++) {const ss=shr.slice(j, j + i);
if (lon.includes(ss)) return ss;}}return "";}
console.log(ar.reduce((ac, cur) => lcs(ac, cur), ar[0] || ""));