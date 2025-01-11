export const getUnreadNotifications = (notifications) => {
    notifications?.length > 0
    return notifications?.filter((item) => item?.isRead === false)
}