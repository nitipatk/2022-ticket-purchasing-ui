import styles from '../styles/footer/Footer.module.scss'

const Footer =()=>{
    return(
        <>
            <div className={styles.footer}>
                <div className={styles.row}>
                <div className={styles.col}>
                    <h4>ABOUT US</h4>
                    <p>About</p>
                    <p>Our story</p>
                </div>
                <div className={styles.col}>
                    <h4>HELPFUL LINK</h4>
                    <p>Help/FAQ</p>
                    <p>Contact us</p>
                    <p>Submit on issue</p>
                </div>
                <div className={styles.col}>
                    <h4>LEGAL</h4>
                    <p>Terms & Conditions</p>
                    <p>Privacy Policy</p>
                    <p>Terms of use</p>
                </div>
                </div>
                <div className={styles.row}>
                <div className={styles.col}>
                    <h4>SUBSCRIBE</h4>
                    <p>Subscribe to our newsletter to get your weekly dose of news.</p>
                    <input placeholder="name@email.com"/>
                    <div className={styles.sendBtn}>SEND</div>
                </div>
                </div>
            </div>
        </>
    )
}

export default Footer