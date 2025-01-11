import moment from "moment";

export const formatMessageDate = (date) => {
    const now = moment();
    const messageDate = moment(date);

    if (messageDate.isSame(now, 'day')) return 'Today';
    if (messageDate.isSame(now.subtract(1, 'days'), 'day')) return 'Yesterday';
    if (messageDate.isSame(now, 'year')) return messageDate.format('D MMM');
    return messageDate.format('D MMM YYYY');
};

export const isNewDay = (currentMessage, previousMessage) => {
    if (!previousMessage) return true;
    const currentDate = moment(currentMessage.created_at).startOf('day');
    const previousDate = moment(previousMessage.created_at).startOf('day');
    return !currentDate.isSame(previousDate);
};