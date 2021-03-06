// STJJのメインタイプ
const mainTypes = ['オブジェクト', '人事', 'Tale', 'Incident', 'Canon', 'Hub'] as const
export type MainType = typeof mainTypes[number]
// STJJのルールで定義されたサブタイプ（使わないかも）
const ruleDefinedSubTypes = ['【効果】', '【コンビ】', '【フィールド】', '【トークン】', '【契約】'] as const
export type RuleDefinedSubType = typeof ruleDefinedSubTypes[number]
// STJJのOC
const objectClasses = ['Safe', 'Euclid', 'Keter', 'Thaumiel', 'Neutralized', 'Unclassed', 'Anomalous', 'Explained'] as const
export type ObjectClass = typeof objectClasses[number]

// カード
export interface Card {
    _id?: string
    pageid: number
    name: string
    cost?: number
    attack?: number
    oc?: ObjectClass
    maintypes: [MainType, ...MainType[]];
    subtypes?: [string, ...string[]];
    effect?: string
    tags?: [string, ...string[]];
    banned?: true
    latest_revid: number
    page_title?: string
}
