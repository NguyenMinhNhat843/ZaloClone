const uploadToImgBB = async (imageUri: string) => {
    console.log("uploadToImgBB", imageUri)
    const formData = new FormData();
    formData.append('image', {
        uri: imageUri,
        type: 'image/png',
        name: 'avatar.png',
    } as any);

    const apiKey = 'ebb4516a54242afaf2686d4109a38c0f';

    const response = await fetch(`https://api.imgbb.com/1/upload?expiration=600&key=${apiKey}`, {
        method: 'POST',
        body: formData,
    });

    const json = await response.json();
    if (json.success) {
        return json.data.url; // Trả về URL ảnh đã upload
    } else {
        throw new Error('Upload failed');
    }
};

export { uploadToImgBB };