import type { NextApiRequest, NextApiResponse } from "next";
import { promises as fs } from 'fs';
import path from 'path';
import crypto from 'crypto';

const filePath = path.resolve('./public/data.json');

export type TodoState = 'todo' | 'progress' | 'done';

export type TodoItem = {
  id: string;
  text: string;
  state: TodoState;
};

export async function readData(): Promise<TodoItem[]> {
  try {
    const fileStrContent = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(fileStrContent);
  } catch (err) {
    console.error('Failed to read data:', err);
    throw new Error('Failed to read data');
  }
}

async function writeData(data: TodoItem[]): Promise<void> {
  try {
    const stringifiedJSON = JSON.stringify(data, null, 2); // Pretty print JSON
    await fs.writeFile(filePath, stringifiedJSON, 'utf-8');
  } catch (err) {
    console.error('Failed to write data:', err);
    throw new Error('Failed to write data');
  }
}

async function updateData(updateFn: (data: TodoItem[]) => TodoItem[]): Promise<TodoItem[]> {
  const data = await readData();
  const updatedData = updateFn(data);
  await writeData(updatedData);
  return updatedData;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'GET': {
        const data = await readData();
        res.status(200).json(data);
        break;
      }
      case 'POST': {
        const reqData: TodoItem = JSON.parse(req.body);
        reqData.id = crypto.randomUUID();
        const updatedData = await updateData(data => [...data, reqData]);
        res.status(201).json(updatedData);
        break;
      }
      case 'DELETE': {
        const { id } = JSON.parse(req.body);
        const updatedData = await updateData(data => data.filter(item => item.id !== id));
        res.status(200).json(updatedData);
        break;
      }
      case 'PUT': {
        const reqData: TodoItem = JSON.parse(req.body);
        const updatedData = await updateData(data =>
          data.map(item => item.id === reqData.id ? { ...item, ...reqData } : item));
        res.status(200).json(updatedData);
        break;
      }
      default:
        res.setHeader('Allow', ['GET', 'POST', 'DELETE', 'PUT']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (err) {
    const message = (err as Error).message;
    res.status(500).json({ message });
  }
}