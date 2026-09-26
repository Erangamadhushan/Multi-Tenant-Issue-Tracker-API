export const cn = (...classes: Array<string | false | null | undefined>) => classes.filter(Boolean).join(' ');

export const initials = (name: string) => name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase();
