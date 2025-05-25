const arr = ["1, 2, 3, 4, 5", "2, 2, 4, 4, 9, 9", "3, 3, 5, 5, 7, 7"];

for (let i = 0; i < arr.length; i++) {
  console.log(arr[i].split(",").map(Number));
}
