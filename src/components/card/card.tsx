import { TodoItem } from "@/pages/api/list"
import { FC } from "react"
import styles from './card.module.css';

function getNextColumnState(state: string) {
    if(state === 'todo'){
        return 'progress'
    }
    if(state === 'progress'){
        return 'done'
    }
    return 'todo';
}

export const Card: FC<TodoItem & { setItems: (items: TodoItem[]) => void }> = ({ id, text, state, setItems }) => {
    const handleDelteItem = () => {
        fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/list`, { 
            method: 'DELETE',
            body: JSON.stringify({ id })
        })
        .then(res => {
            return res.json()
        })
        .then(json => {
            setItems(json);
        });
    }

    const handleMoveItem = () => {
        fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/list`, { 
            method: 'PUT',
            body: JSON.stringify({ id, text, state: getNextColumnState(state) })
        })
        .then(res => {
            return res.json()
        })
        .then(json => {
            setItems(json);
        });
    }

    return (
        <div className={styles.container}>
            <p className={styles.text}>{text}</p>
            <div className={styles.controls}>
                <button onClick={handleDelteItem} className={styles.button}>&#9932;</button>
                <button onClick={handleMoveItem} className={styles.button}>&#10230;</button>
            </div>
        </div>
    )
}