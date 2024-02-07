import styles from './home.module.css'
import { Board } from "../components/board";
import { GetServerSideProps } from 'next';
import { TodoItem, readData } from './api/list';
import { FC } from 'react';

export const getServerSideProps = (async () => {
  const data = await readData();

  return { props: { todoData: data } };

}) satisfies GetServerSideProps<{ todoData: TodoItem[] }>

const Home: FC<{todoData: TodoItem[]}> = ({ todoData }) => {
  return (
    <main className={styles.container}>
      <Board data={todoData} />
    </main>
  );
}

export default Home;
