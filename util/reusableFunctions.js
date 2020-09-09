const compareConcatArrays = (arr1,arr2) => {
    const concatenated = arr1.concat(arr2)
    let temp = {}
    const res = concatenated.filter(d => {
      let key = d.join('-')
      temp[key] = (temp[key] || 0) + 1
  
      return temp[key] === 2
  })
  return res
}


exports.compareConcatArrays = compareConcatArrays