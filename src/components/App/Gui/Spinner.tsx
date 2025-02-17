import styles from 'GuiStyles/Spinner.module.scss';
export { Spinner };

const Spinner = ({ raysCount = 12 }) => {
    const rays = Array(raysCount)
        .fill(null)
        .map((_, index) => <div key={index} className={styles.ray}></div>);

    return (
        <div className={styles.Spinner}>
            {rays}
        </div>
    );
};
