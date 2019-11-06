// 数组洗牌
function getRandomIndex (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}
export function shuffle (rawArr) {
  // 拷贝一个数组，不至于对原数组造成影响
  let arr = rawArr.slice()
  for (let i = 0; i < arr.length; i++) {
    let randomIndex = getRandomIndex(0, i)
    let temp = arr[i]
    arr[i] = arr[randomIndex]
    arr[randomIndex] = temp
  }
  return arr
}
