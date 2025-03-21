import React, { createContext, useContext } from "react";

const EventBusContext = createContext();

export const EventBusProvider = ({ children }) => {
    const events = {};

    const emit = (name, data) => {
        if (events[name]) {
            for (let cb of events[name]) {
                cb(data);
            }
        }
    };

    const on = (name, cb) => {
        if (!events[name]) {
            events[name] = [];
        }
        events[name].push(cb);

        return () => {
            events[name] = events[name].filter(callback => callback !== cb);
        };
    };

    return (
        <EventBusContext.Provider value={{ emit, on }}>
            {children}
        </EventBusContext.Provider>
    );
};

export const useEventBus = () => {
    return useContext(EventBusContext);
};
