import ckie from 'js-cookie'

export function toTitleCase(str: string): string {
    return str
        .replace(/-/g, ' ')
        .replace(
            /\w\S*/g,
            (txt) => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase()
        );
}

export function isLogged(): boolean {
    const token = ckie.get('token')
    if (token) return true
    return false
}

