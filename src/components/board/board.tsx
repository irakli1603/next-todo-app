import { FC, FormEvent, useState } from 'react';
import { Column } from '../column';
import style from './board.module.css';
import { TodoItem } from '@/pages/api/list';

export const Board: FC<{ data: TodoItem[]}> = ({ data }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [items, setItems] = useState(data); 

    const todoItems = items.filter(todoItem => todoItem.state === 'todo');
    const inProgressItems = items.filter(todoItem => todoItem.state === 'progress');
    const doneItems = items.filter(todoItem => todoItem.state === 'done');

    const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        const form = e.currentTarget;
        const formData = new FormData(form);
        const formJson = Object.fromEntries(formData.entries());
        formJson.state = 'todo';

        if(formJson.text) {
            fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/list`, { 
                method: 'POST',
                body: JSON.stringify(formJson)
            })
            .then(res => {
                form.reset();
                return res.json()
            })
            .then(json => {
                setItems(json);
            })
            .finally(() => setIsSubmitting(false))
        } else {
            setIsSubmitting(false)
        }
    }   

    return (
        <div className={style.container}>
            <form onSubmit={handleFormSubmit} className={style.form}>
                <input type="text" placeholder='enter your todo here...' name="text" />
                <input type="submit" disabled={isSubmitting} />
            </form>
            <div className={style.columnContainer}>
                <Column rowTitle='To Do' todoData={todoItems} setItem={setItems} />
                <Column rowTitle='In Progress' todoData={inProgressItems} setItem={setItems} />
                <Column rowTitle='Done' todoData={doneItems} setItem={setItems} />
            </div>
        </div>
    )
}