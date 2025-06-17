import moment from "moment";

export const formatDueDate = (date: string | Date | null | undefined, showTime = true) => {
    // if (!date) return "";

    const momentDate = moment(date);
    const day = momentDate.date();
    const month = momentDate.format('MMMM');
    const time = momentDate.format('h:mm A');

    // Add ordinal suffix to day
    const ordinalSuffix = (day: number) => {
        if (day > 3 && day < 21) return 'th';
        switch (day % 10) {
            case 1: return 'st';
            case 2: return 'nd';
            case 3: return 'rd';
            default: return 'th';
        }
    };
    
    if(!showTime){
        return `Due ${day}${ordinalSuffix(day)} ${month}`;
    }

    return `Due ${day}${ordinalSuffix(day)} ${month} • ${time}`;
};