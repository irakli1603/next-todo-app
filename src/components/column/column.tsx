import { Card } from '../card';
import { FC } from 'react';
import style from './column.module.css';
import { TodoItem } from '@/pages/api/list';

export const Column: FC<{ rowTitle: string, todoData: TodoItem[], setItem: (item: TodoItem[]) => void }> = ({ rowTitle, todoData, setItem }) => {
    return (
        <div className={style.container}>
            <h3>
                {rowTitle}
            </h3>
            <ul className={style.listContainer}>
                {
                    todoData.map(todoItem => <Card {...todoItem} key={todoItem.id} setItems={setItem} />)
                }
            </ul>
        </div>
    )
}