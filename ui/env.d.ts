/// <reference types="vite/client" />
import Events, { EventMap } from "../common/Events"

// window.events

declare global {
    interface Window {
        events: {
            on: <K extends keyof EventMap>(event: K, listener: (event: EventMap[K]) => any) => void;
            emit: <K extends keyof EventMap>(event: K, ...args: any[]) => void;
            remove: <K extends keyof EventMap>(event: K, listener: (event: EventMap[K]) => any) => void;
        };
    }
}