export function formatDate(dateStr: string) {
    if (!dateStr) return "";
    return dateStr.slice(0, 10);
}