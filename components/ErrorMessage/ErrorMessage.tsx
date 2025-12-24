import css from './ErrorMessage.module.css';

export default function ErrorMessage() {
  return (
    <div>
      <span className={css.icon}>⚠️</span>
      <p className={css.text}>Something went wrong. Please try again later.</p>
    </div>
  );
}