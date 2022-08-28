import Head from 'next/head'
import styles from '../../styles/checkout/Checkout.module.scss'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import formatDate from '../../utility/formatDate'
import Swal from 'sweetalert2'
import Loader from '../../components/loader'

//data
import formatNumber from '../../utility/formatNumber'

const validateData =(checkType='typing',dataType,data)=>{
    if(checkType == 'typing'){
        if(dataType == 'cardName'){
            if(data == ''){
                document.getElementById('cardName').style.borderColor  = '#aa2229'
                document.getElementById('cardName').style.color  = '#aa2229'
            }
            else{
                document.getElementById('cardName').style.borderColor  = 'gray'
                document.getElementById('cardName').style.color  = 'black'
            }
        }
        else if(dataType == 'cardNumber'){
            if(data == '' || data.length != 15){
                document.getElementById('cardNumber').style.borderColor  = '#aa2229'
                document.getElementById('cardNumber').style.color  = '#aa2229'
            }
            else{
                document.getElementById('cardNumber').style.borderColor  = 'gray'
                document.getElementById('cardNumber').style.color  = 'black'
            }
        }
        else if(dataType == 'exp'){
            if(data == '' || data.length != 4){
                document.getElementById('exp').style.borderColor  = '#aa2229'
                document.getElementById('exp').style.color  = '#aa2229'
            }
            else{
                document.getElementById('exp').style.borderColor  = 'gray'
                document.getElementById('exp').style.color  = 'black'
            }
        }
        else if(dataType == 'cvc'){
            if(data == '' || data.length != 3){
                document.getElementById('cvc').style.borderColor  = '#aa2229'
                document.getElementById('cvc').style.color  = '#aa2229'
            }
            else{
                document.getElementById('cvc').style.borderColor  = 'gray'
                document.getElementById('cvc').style.color  = 'black'
            }
        }
    }
    else if(checkType == 'nextBtn'){
        if(data.fname == '' || data.lname == '' || data.address == '' ||data.quantity == '' || data.ticket_type == ''){
            document.getElementById('errMsg1').innerHTML = '*Plase fill form'
            return false
        }
        else{
            document.getElementById('errMsg1').innerHTML = ''
            return true
        }
    }
    else if(checkType == 'confirmBtn'){
        if(data.type == 'paypal'){
            if(data.policy == true){
                document.getElementById('errMsg2').innerHTML = ''
                return true
            }
            else{
                document.getElementById('errMsg2').innerHTML = '*Please accept term of use'
                return false
            }
        }else{
            if(data.card_holder == ''){
                document.getElementById('errMsg2').innerHTML = '*Plase enter cardholder name.'
                return false
            }
            else if(data.card_number == '' || (data.card_number).length != 15){
                document.getElementById('errMsg2').innerHTML = '*The card number must contain 15 digits.'
                return false
            }
            else if(data.exp == '' || (data.exp).length != 4){
                document.getElementById('errMsg2').innerHTML = '*The exp must contain 4 digits.'
                return false
            }
            else if(data.cvc == '' || (data.cvc).length != 3){
                document.getElementById('errMsg2').innerHTML = '*The cvc must contain 3 digits.'
                return false
            }
            else{
                if(data.policy == true){
                    document.getElementById('errMsg2').innerHTML = ''
                    return true
                }
                else{
                    document.getElementById('errMsg2').innerHTML = '*Please accept term of use'
                    return false
                }
            }
        }
    }
}

const CheckOut =()=>{

    let router = useRouter()
    let ticketData = require('../../data/ticket.json')

    const [isLoading, setLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [data, setData] = useState({})
    const [payment, setPayment] = useState(1)
    const [info, setInfo] = useState({
        quantity:"",
        sum_price:0,
        ticket_type:"",
        fees_price:0,
        f_name:"",
        l_name:"",
        address:"",
        card_name:"",
        card_number:"",
        exp:"",
        cvc:""
    })

    useEffect(()=>{
        if(!router.isReady) return
        setTimeout(()=>{
            const ticketSelected =()=>{
                for(let i=0; i < ticketData.length; i++){
                    if(ticketData[i].ticket_id == router.query['ticket_id']){
                        setData(ticketData[i])
                    }
                }
            }
            ticketSelected()
            setLoading(false)
        },1000)
    },[router,ticketData])  

    const changePage =(action)=>{
        if(action == 'next'){
            let objData ={
                fname: document.getElementById('Fname').value,
                lname: document.getElementById('Lname').value,
                address: document.getElementById('Address').value,
                quantity: document.getElementById('quantity').value,
                ticket_type: document.getElementById('ticket_type').value
            }
            if(validateData('nextBtn','',objData)){
                setInfo({...info,f_name:document.getElementById('Fname').value,l_name:document.getElementById('Lname').value,address:document.getElementById('Address').value})
                setPage(2)
            }
        }else if(action == 'back'){
            console.log(document.getElementById('cardName').value)
            setInfo({
                ...info,
                card_name:document.getElementById('cardName').value,
                card_number:document.getElementById('cardNumber').value,
                exp:document.getElementById('exp').value,
                cvc:document.getElementById('cvc').value
            })
            setPage(1)
        }
    }

    const confirmPayment =()=>{
        let objData = {}
        if(payment == 3){
            objData = {
                type: 'paypal',
                policy:document.getElementById('policy').checked,
            }
        }else{
            objData = {
                type: 'card',
                card_holder:document.getElementById('cardName').value,
                card_number:document.getElementById('cardNumber').value,
                exp:document.getElementById('exp').value,
                cvc:document.getElementById('cvc').value,
                policy:document.getElementById('policy').checked,
            }
        }
        if(validateData('confirmBtn','',objData)){
            if('purchase_successfully'){
                Swal.fire({
                    title: 'Are you sure?',
                    text: "You can't refund this payment",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#149ad6',
                    cancelButtonColor: '#aa2229',
                    confirmButtonText: 'Confirm Payment'
                  }).then((result) => {
                    if (result.isConfirmed) {
                      Swal.fire(
                        'Purchase Successfully!',
                        'Payment amount  '+(formatNumber((info.sum_price)+(Number(data.ticket_price)/5*info.quantity)+2.95+info.fees_price))+'$  already confirmed.',
                        'success'
                      )
                      setLoading(true)
                      setTimeout(()=>{
                        router.push('/')
                      },1000)
                    }
                  })
            }
        }
    }

    const WebPage =()=> {

        const Section1 =()=>{
            let ticketAmount = []
            for(let i=0;i < data.ticket_amount; i++){
                ticketAmount.push(<option key={i+1} value={i+1}>{i+1}</option>)
            }
            ticketAmount = [<option key={''} disabled={true} value=''>Select Quantity</option>,...ticketAmount]

            return(
                <>
                    <section className={styles.content1}>
                        <div className={styles.leftContent}>
                            <div className={styles.header}>
                                <h2>How many tickets ?</h2>
                            </div>
                            <div className={styles.line}>
                                <select defaultValue={info.quantity} id='quantity' onChange={(e)=>{
                                        if(e.target.value != ""){
                                            setInfo({...info,quantity:e.target.value,sum_price:Number(data.ticket_price)*e.target.value,f_name:document.getElementById('Fname').value,l_name:document.getElementById('Lname').value,address:document.getElementById('Address').value})
                                        }
                                        else{
                                            setInfo({...info,quantity:e.target.value,sum_price:0,f_name:document.getElementById('Fname').value,l_name:document.getElementById('Lname').value,address:document.getElementById('Address').value})
                                        }
                                    }
                                }>
                                    {
                                        ticketAmount
                                    }
                                </select>
                                <small>Tickets Price: ${formatNumber(info.sum_price)}</small>
                            </div>
                            <div className={styles.header}>
                                <h2>Tickets Type</h2>
                            </div>
                            <div className={styles.line}>
                                <select defaultValue={info.ticket_type} id='ticket_type' onChange={(e)=>{
                                        if(e.target.value == "Tickets"){
                                            setInfo({...info,ticket_type:e.target.value,fees_price:10.05,f_name:document.getElementById('Fname').value,l_name:document.getElementById('Lname').value,address:document.getElementById('Address').value})
                                        }
                                        else{
                                            setInfo({...info,ticket_type:e.target.value,fees_price:0,f_name:document.getElementById('Fname').value,l_name:document.getElementById('Lname').value,address:document.getElementById('Address').value})
                                        }
                                    }
                                }>
                                    <option value="" disabled={true}>Select Tickets Type</option>
                                    <option value="Mobile Entry">Mobile Entry</option>
                                    <option value="Tickets">Tickets</option>
                                </select>
                                <small>Shipping Fees: ${formatNumber(info.fees_price)}</small>
                            </div>
                            <div className={styles.header}>
                                <h2>Personal Information</h2>
                            </div>
                            <div className={styles.inpField}>
                                <p>First Name</p>
                                <input defaultValue={info.f_name} placeholder="Enter First Name" type="text" id="Fname" onKeyUp={(e)=>validateData('typing','Cities',e.target.value)}/>
                            </div>
                            <div className={styles.inpField}>
                                <p>Last Name</p>
                                <input defaultValue={info.l_name} placeholder="Enter Last Name" type="text" id="Lname" onKeyUp={(e)=>validateData('typing','Cities',e.target.value)}/>
                            </div>
                            <div className={styles.inpField}>
                                <p>Address</p>
                                <input defaultValue={info.address} placeholder="Enter Address" type="text" id="Address" onKeyUp={(e)=>validateData('typing','Cities',e.target.value)}/>
                            </div>
                        </div>
                        <div className={styles.rightContent}>
                            <div className={styles.summary}>
                                <h1>{data.ticket_name}<br />({data.ticket_type})</h1>
                                <p>Price: ${formatNumber(data.ticket_price)} / ticket</p>
                                <p>Ticket remaining: {formatNumber(data.ticket_amount)}</p>
                                <p>Venue capacity: {formatNumber(data.ticket_vanue_capacity)}</p>
                                <h2>Location: {data.ticket_location}</h2>
                                <h1>{formatDate(data.ticket_date)}</h1>
                            </div>
                            <div className={styles.nextBtn} onClick={()=>changePage('next')}>Next</div>
                            <small id='errMsg1'></small>
                        </div>
                    </section>
                </>
            )
        }

        const Section2 =()=>{

            const Details =()=>{
                return(
                    <>
                        <div className={styles.header}>
                                <h3>{(payment == 1)? "Visa" : (payment == 2)? "Mastercard" : "Paypal"}</h3>
                            </div>
                            <div className={styles.lineCol}>
                                <div className={styles.inpField}>
                                    <p>Cardholder Name</p>
                                    <input defaultValue={info.card_name} placeholder="Enter Cardholder Name" type="text" id="cardName" onKeyUp={(e)=>validateData('typing','cardName',e.target.value)}/>
                                </div>
                                <div className={styles.inpField}>
                                    <p>Cardholder Number</p>
                                    <input defaultValue={info.card_number} onInput={(e)=>{e.target.value = e.target.value.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1')}} placeholder="Enter Cardholder Number" type="text" id="cardNumber" maxLength={15} onKeyUp={(e)=>validateData('typing','cardNumber',e.target.value)}/>
                                </div>
                            </div>
                            <div className={styles.lineRow}>
                                <div className={styles.inpField}>
                                    <p>Expire Date</p>
                                    <input defaultValue={info.exp} onInput={(e)=>{e.target.value = e.target.value.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1')}} className={styles.expire} type="text" placeholder="MMYY" id="exp" maxLength={4} onKeyUp={(e)=>validateData('typing','exp',e.target.value)} />
                                </div>
                                <div className={styles.inpField} >
                                    <p>CVC/CVV</p>
                                    <input defaultValue={info.cvc} onInput={(e)=>{e.target.value = e.target.value.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1')}} className={styles.cvc} type="text" placeholder="CVC" id="cvc" maxLength={3} onKeyUp={(e)=>validateData('typing','cvc',e.target.value)} />
                                </div>
                            </div>
                    </>
                )
            }

            return(
                <>
                    <section className={styles.content2}>
                        <div className={styles.leftContent}>
                            <div className={styles.box1}>
                                <div className={styles.header}>
                                    <h2>Delivery</h2>
                                </div>
                                <div className={styles.details}>
                                    <h3>{info.ticket_type} - {info.fees_price != 0 ? '$'+info.fees_price : 'Free'}</h3>
                                </div>
                                <div className={styles.details}>
                                    <p>Tickets Available by {formatDate(data.ticket_date)}</p>
                                </div>
                                <div className={styles.details}>
                                    <div className={styles.p}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</div>
                                </div>
                            </div>
                            <div className={styles.box2}>
                                <div className={styles.paymentHeader}>
                                    <h2>Payment</h2>
                                </div>
                                <div className={styles.row}>
                                    <div className={styles.method}>
                                        <div className={(payment == 1) ? styles.paymentBoxSelected : styles.paymentBox} onClick={()=>setPayment(1)}>
                                            <img src="/icons/visa-credit-card.svg" alt="visa" />
                                        </div>
                                        <div className={(payment == 2) ? styles.paymentBoxSelected : styles.paymentBox} onClick={()=>setPayment(2)}>
                                            <img src="/icons/mastercard.svg" alt="mastercard" />
                                        </div>
                                        <div className={(payment == 3) ? styles.paymentBoxSelected : styles.paymentBox} onClick={()=>setPayment(3)}>
                                            <img src="/icons/paypal.svg" alt="paypal" />
                                        </div>
                                    </div>
                                    <div className={styles.details}>
                                        { (payment == 3) ? <h2>Paypal Connected Successfully !</h2> : <Details /> }
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={styles.rightContent}>
                            <div className={styles.box3}>
                                <div className={styles.header}>
                                    <h2>Total</h2>
                                    <h2>${(formatNumber((info.sum_price)+(Number(data.ticket_price)/5*info.quantity)+2.95+info.fees_price))}</h2>
                                </div>
                                <div className={styles.details}>
                                    <h3>Tickets</h3>
                                </div>
                                <div className={styles.details}>
                                    <p>Resale Tickets</p>
                                    <p>${formatNumber(info.sum_price)}</p>
                                </div>
                                <div className={styles.details}>
                                    <h3>Notes From Sellers</h3>
                                </div>
                                <div className={styles.details}>
                                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                                </div>
                                <div className={styles.details}>
                                    <h3>Fees</h3>
                                </div>
                                <div className={styles.details}>
                                    <p>Service Fee: ${formatNumber((Number(data.ticket_price)/5))} x {info.quantity}</p>
                                    <p>${formatNumber((Number(data.ticket_price)/5*info.quantity).toFixed(2))}</p>
                                </div>
                                <div className={styles.details}>
                                    <p>Order Processing Fee</p>
                                    <p>$2.95</p>
                                </div>
                                <div className={styles.details}>
                                    <h3>Delivery</h3>
                                </div>
                                <div className={styles.details}>
                                    <p>{info.ticket_type}</p>
                                    <p>{info.fees_price != 0 ? '$'+formatNumber((info.fees_price).toFixed(2)) : 'Free'}</p>
                                </div>
                                <div className={styles.details}>
                                    <h4>*All Sales Final - No Refunds</h4>
                                </div>
                            </div>
                            <div className={styles.rowPrivacy}>
                                <div>
                                    <input type="checkbox" id='policy' />
                                </div>
                                <div><p>I have read and agree to the current<a> Term of use</a>.</p> </div>
                            </div>
                            <div className={styles.purchaseBtn} onClick={confirmPayment}>
                                PLACE ORDER
                            </div>
                            <small id='errMsg2'></small>
                        </div>
                    </section>
                </>
            )
        }
       
        return(
            <>
                <section className={styles.webPage}>
                    <div className={styles.backContainer}>
                    {(page == 2) ? <div className={styles.backBtn} onClick={()=>changePage('back')}>Back</div> : null}
                    </div>
                    {(page == 1) ? <Section1 /> : <Section2 />}
                </section>
            </>
        )
    }

    return(
        <>
            <Head>
                <title>Ticket Purchasing UI</title>
                <meta name="description" content="Generated by create next app" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            {(isLoading === true) ? <Loader />:<WebPage />} 
        </>
    )
}

export default CheckOut