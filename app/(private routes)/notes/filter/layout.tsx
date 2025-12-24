import React from 'react';
import css from './layout.module.css';

type Props = {
  children: React.ReactNode;
  sidebar: React.ReactNode;
};

const NotesLayout = ({ children, sidebar }: Props) => {
  return (
    <section className={css.container}>
      <aside className={css.sidebar}>{sidebar}</aside>
      <div className={css.notesWrapper}>
        <main>{children}</main>
      </div>
    </section>
  );
};

export default NotesLayout;