export const formatFileSizeWithType = (uri: string, bytes: number): string => {
    if (bytes === 0) return 'Unknown - 0 Bytes';

    // 👉 1. Lấy phần mở rộng file (đuôi)
    const decodedUri = decodeURIComponent(uri);
    const fileName = decodedUri.split('/').pop() || '';
    const extMatch = fileName.match(/\.(\w+)(\?.*)?$/);
    const extension = extMatch ? extMatch[1].toUpperCase() : 'Unknown';

    // 👉 2. Tính kích thước file
    const units = ['Bytes', 'KB', 'MB', 'GB'];
    const k = 1024;
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const size = parseFloat((bytes / Math.pow(k, i)).toFixed(2));

    return `${extension} - ${size} ${units[i]}`;
};

export const getCleanFileNameFromURI = (uri: string): string => {
    try {
        const decodedUri = decodeURIComponent(uri); // giải mã %20 -> khoảng trắng
        const fileNameWithExt = decodedUri.split('/').pop(); // Lấy phần cuối sau "/"

        if (!fileNameWithExt) return '';

        // Tách tên và đuôi file
        const lastDotIndex = fileNameWithExt.lastIndexOf('.');
        const ext = fileNameWithExt.slice(lastDotIndex); // .docx
        const nameOnly = fileNameWithExt.slice(0, lastDotIndex); // SE_NOI DUNG PRETEST_2024_67f5...

        // Loại bỏ phần mã hash (phía sau dấu "_")
        const parts = nameOnly.split('_');
        if (parts.length > 1) {
            parts.pop(); // loại bỏ đoạn hash cuối
        }

        return parts.join(' ') + ext;
    } catch (err) {
        console.error("❌ Lỗi khi lấy tên file từ uri:", err);
        return '';
    }
};

export const truncateMiddle = (text: string): string => {
    const maxLength = 25
    if (text.length <= maxLength) return text;

    const frontChars = Math.ceil(maxLength / 2);
    const backChars = Math.floor(maxLength / 2) - 1;

    return `${text.slice(0, frontChars)}...${text.slice(-backChars)}`;
};

const mimeTypes: Record<string, string> = {
    pdf: 'application/pdf',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    doc: 'application/msword',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    png: 'image/png',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    mp4: 'video/mp4',
    txt: 'text/plain',
};

export const getMimeType = (fileName: string): string => {
    const ext = fileName.split('.').pop()?.toLowerCase() || '';
    return mimeTypes[ext] || '*/*'; // fallback nếu không có
};

export const formatTimeFromDate = (date: Date | string): string => {
    const d = typeof date === 'string' ? new Date(date) : date;

    const hours = d.getHours().toString().padStart(2, '0');
    const minutes = d.getMinutes().toString().padStart(2, '0');

    return `${hours}:${minutes}`;
};