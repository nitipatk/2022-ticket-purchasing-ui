const formatDate =(date,mark="-")=>{
    let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    let strDate = date.split(" ")
    let arrDate = strDate[0].split(mark)
    let dateF = String(arrDate[0])
    let monthF = months[Number(arrDate[1]) + 1]
    let yearF = String(arrDate[2])
    return monthF + " " +dateF + ", " + yearF
}

export default formatDate