import { Faq } from './types';

export function buildFaqTree(faqs: Faq[], parentId?: string): Faq[] {
    return faqs
        .filter(faq => faq.parentId === parentId)
        .map(faq => ({
            ...faq,
            children: buildFaqTree(faqs, faq.id)
        }));
}

export function flattenFaqTree(faqs: Faq[]): Faq[] {
    const result: Faq[] = [];

    function traverse(faqList: Faq[]) {
        faqList.forEach(faq => {
            result.push(faq);
            if ((faq as any).children) {
                traverse((faq as any).children);
            }
        });
    }

    traverse(faqs);
    return result;
}

export function findFaqById(faqs: Faq[], id: string): Faq | null {
    for (const faq of faqs) {
        if (faq.id === id) return faq;
        if ((faq as any).children) {
            const found = findFaqById((faq as any).children, id);
            if (found) return found;
        }
    }
    return null;
}