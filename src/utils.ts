export function shuffleArray<T>(array: T[], seed: number) {
    const random = () => {
      var x = Math.sin(seed++) * 10000
      return x - Math.floor(x)
    }
    for (var iters = 0; iters < 5; iters++) {
      for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(random() * (i + 1))
        var temp = array[i]
        array[i] = array[j]
        array[j] = temp
      }
    }
  }