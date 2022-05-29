// Returns a new set that is the intersection of the two sets
// if SetA is null, just return a new set containing setB
export function intersection<T>(setA: Set<T> | null, setB: Set<T>) {
    if (setA == null) return new Set(setB)
    let _intersection = new Set<T>()
    for (let elem of setB) {
        if (setA.has(elem)) {
            _intersection.add(elem)
        }
    }
    return _intersection
}

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