const isToday = (date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
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
    if (!(date instanceof Date) || isNaN(date.getTime())) {
        return 'Invalid date';
    }

    const today = new Date();

    if (isToday(date)) {
        return date.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
        });
    } else if (isYesterday(date)) {
        return "Yesterday " + date.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
        });
    } else if (date.getFullYear() === today.getFullYear()) {
        return date.toLocaleDateString([], {
            day: '2-digit',
            month: 'short'
        });
    } else {
        return date.toLocaleDateString();
    }
}

export const formatDateShort = (date) => {
    if (!(date instanceof Date) || isNaN(date.getTime())) {
        return 'Invalid date';
    }

    const today = new Date();

    if (isToday(date)) {
        return date.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
        });
    } else if (isYesterday(date)) {
        return "Yesterday";
    } else if (date.getFullYear() === today.getFullYear()) {
        return date.toLocaleDateString([], {
            day: '2-digit',
            month: 'short'
        });
    } else {
        return date.toLocaleDateString();
    }
}

export const isImage = (attachment) => {
    let mime = attachment.mime || attachment.type;
    if (!mime) return false;
    mime = mime.split('/');
    return mime[0].toLowerCase() === 'image';
}

export const isVideo = (attachment) => {
    let mime = attachment.mime || attachment.type;
    if (!mime) return false;
    mime = mime.split('/');
    return mime[0].toLowerCase() === 'video';
}

export const isAudio = (attachment) => {
    let mime = attachment.mime || attachment.type;
    if (!mime) return false;
    mime = mime.split('/');
    return mime[0].toLowerCase() === 'audio';
}

export const isPDF = (file) => {
    console.log('pdf', file);
    let type = file.type;
    return type.toLowerCase() === 'application/pdf';
}

export const isPreviewable = (attachment) => {
    return isAudio(attachment) || isImage(attachment) || isVideo(attachment) || isPDF(attachment);
}

export const formatBytes = (bytes, decimal = 2) => {
    if(bytes == 0) return "0 bytes";

    const x = 1024;
    let size = bytes;
    decimal = decimal <= 0 ? 0 : decimal;
    const sizes = ['bytes', 'KB', 'MB', 'GB'];

    let i = 0;
    while(size >= x){
        size /= x;
        i++
    };

    return parseFloat(size.toFixed(decimal)) + " " + sizes[i];
}
