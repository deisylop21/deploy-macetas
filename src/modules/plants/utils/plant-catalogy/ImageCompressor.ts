export async function compressImage(
    file: File,
    maxSizeMB: number = 1,
    maxWidth: number = 1200
): Promise<File> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target?.result as string;

            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                if (width > maxWidth) {
                    const ratio = maxWidth / width;
                    width = maxWidth;
                    height = height * ratio;
                }

                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                ctx?.drawImage(img, 0, 0, width, height);

                canvas.toBlob(
                    (blob) => {
                        if (!blob) {
                            reject(new Error('Error al comprimir la imagen'));
                            return;
                        }

                        const sizeInMB = blob.size / (1024 * 1024);

                        if (sizeInMB <= maxSizeMB) {
                            const newFile = new File([blob], file.name, {
                                type: 'image/jpeg',
                                lastModified: Date.now()
                            });
                            resolve(newFile);
                        } else {
                            canvas.toBlob(
                                (smallerBlob) => {
                                    if (!smallerBlob) {
                                        reject(new Error('Error al comprimir la imagen'));
                                        return;
                                    }
                                    const newFile = new File([smallerBlob], file.name, {
                                        type: 'image/jpeg',
                                        lastModified: Date.now()
                                    });
                                    resolve(newFile);
                                },
                                'image/jpeg',
                                0.7
                            );
                        }
                    },
                    'image/jpeg',
                    0.9
                );
            };

            img.onerror = () => {
                reject(new Error('Error al cargar la imagen'));
            };
        };

        reader.onerror = () => {
            reject(new Error('Error al leer el archivo'));
        };
    });
}

export function isFileTooLarge(file: File, maxSizeMB: number = 5): boolean {
    const sizeInMB = file.size / (1024 * 1024);
    return sizeInMB > maxSizeMB;
}