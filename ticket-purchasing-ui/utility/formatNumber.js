const formatNumber =(numInp=0)=>{
    const formatted = ''
    const options = {
      mimimumFranctionDigits: 2,
      maximumFranctionDigits: 2
    }
    formatted = Number(numInp).toLocaleString('en',options)
    return formatted
}

export default formatNumber