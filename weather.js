function weatherSlice(temperatures) {
  // divide the received hourly temperatures into days and extract the highest and lowest temperature
  let res = [];
  let day_res = [];
  for (let i = 0; i < temperatures.length; i++) {
    day_res.push(temperatures[i]);
    if (i % 24 === 23) {
      res.push([Math.max.apply(null, day_res), Math.min.apply(null, day_res)]);
      day_res = [];
    }
  }
  return res;
}

module.exports = weatherSlice;
