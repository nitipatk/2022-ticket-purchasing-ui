import styles from '../styles/loader/Loader.module.scss';

const Loader =()=>{
    return(
        <>
            <div className={styles.screen}>
                <div className={styles.loadPad}>
                    <div className={styles.spinning}>
                    <div className={styles.ldsSpinner}>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Loader