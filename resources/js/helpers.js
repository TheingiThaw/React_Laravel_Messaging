const isToday = (date) => {
    const today = new Date();
    return date.getDay() === today.getDay() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear();
}

const isYesterday = (date) => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    return date.getDate() === yesterday.getDate() &&
           date.getMonth() === yesterday.getMonth() &&
           date.getFullYear() === yesterday.getFullYear();
}

export const formatDateLong = (date) => {
    const today = new Date();

    if(!isNaN(date)){
        if(isToday(date)){
            return date.toLocaleDateString([], {
                hour : '2-digit',
                minute : '2-digit'
            });
        }
        else if(isYesterday(date)){
            return ( "Yesterday " + date.toLocaleDateString([], {
                hour : '2-digit',
                minute : '2-digit'
        }));
        }
        else if(date.getFullYear === today.getFullYear ||
            date.getMonth === today.getMonth
        ){
            return date.toLocaleDateString([],{
                day: '2-digit',
                month: 'short'
            });
        }
        else{
            return date.toLocaleDateString();
        }
    }
}

export const formatDateShort = (date) => {
    const today = new Date();

    if(!isNaN(date)){
        if(isToday(date)){
            return date.toLocaleDateString([], {
                hour : '2-digit',
                minute : '2-digit'
            });
        }
        else if(isYesterday(date)){
            return  "Yesterday";
        }
        else if(date.getFullYear === today.getFullYear ||
            date.getMonth === today.getMonth){
            return date.toLocaleDateString([],{
                day: '2-digit',
                month: 'short'
            });
        }
        else{
            return date.toLocaleDateString();
        }
    }
}

