export const formatMediaFile = (file) => {
    return {
        original_url: file.path,
        preview_url: file.path,
        file_type: file.mimetype.split('/')[0],
        file_name: file.originalname,
        file_extension: file.mimetype.split('/')[1],
        file_size: file.size,
        mime_type: file.mimetype,
    }
};
