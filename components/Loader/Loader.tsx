import css from './Loader.module.css';

export default function Loader() {
  return (
    <div className={css.loaderContainer}>
      <p className={css.text}>Loading notes, please wait...</p>
    </div>
  );
}