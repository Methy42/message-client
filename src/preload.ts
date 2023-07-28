import { contextBridge, ipcRenderer } from 'electron';
import events, { EventMap } from "../common/Events"

contextBridge.exposeInMainWorld('events', {
    on: <K extends keyof EventMap>(event: K, listener: (event: EventMap[K]) => void) => events.addEventListener(event as (string & K), listener),
    emit: <K extends keyof EventMap>(event: K, ...args: any[]) => events.dispatchEvent(new CustomEvent(event as string, { detail: { ...args } })),
    remove: <K extends keyof EventMap>(event: K, listener: (event: EventMap[K]) => any) => events.removeEventListener(event as (K & string), listener)
});

events.addEventListener("set-window-size", (event) => {
    ipcRenderer.send(event.type, event);
});
