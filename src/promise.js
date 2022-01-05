let p = new Promise((reslove, reject) => {
    reslove('oka')
})
p.then(value => {
    console.log(value)
}, resion => {
    console.warn(resion)
})