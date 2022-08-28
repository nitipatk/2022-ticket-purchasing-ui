const formatNumber =(numInp=0)=>{
    const options = {
      mimimumFranctionDigits: 2,
      maximumFranctionDigits: 2
    }
    const formatted = Number(numInp).toLocaleString('en',options)
    return formatted
}

export default formatNumber