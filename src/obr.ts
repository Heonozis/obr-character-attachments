export function getPluginId(path: string) {
    return `rodeo.owlbear.character-sheets/${path}`;
}

export function isPlainObject(
    item: unknown
): item is Record<keyof any, unknown> {
    return (
        item !== null && typeof item === "object" && item.constructor === Object
    );
}
