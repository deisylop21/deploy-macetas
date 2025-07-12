export interface TaxonomicNode {
    id: string;
    name: string;
    rank: TaxonomicRank;
    parentId?: string;
    createdAt?: string;
}

export enum TaxonomicRank {
    DOMAIN = 'DOMAIN',
    KINGDOM = 'KINGDOM',
    SUBKINGDOM = 'SUBKINGDOM',
    DIVISION = 'DIVISION',
    SUBDIVISION = 'SUBDIVISION',
    SUPERCLASS = 'SUPERCLASS',
    CLASS = 'CLASS',
    SUBCLASS = 'SUBCLASS',
    ORDER = 'ORDER',
    SUBORDER = 'SUBORDER',
    FAMILY = 'FAMILY',
    SUBFAMILY = 'SUBFAMILY',
    TRIBE = 'TRIBE',
    SUBTRIBE = 'SUBTRIBE',
    GENUS = 'GENUS',
    SUBGENUS = 'SUBGENUS',
    SECTION = "SECTION",
    SPECIES = 'SPECIES'
}