import type { LucideIcon } from 'lucide-react'
import type { ButtonHTMLAttributes } from 'react'
import '../styles/components/action-button.css'

export type ActionButtonProps = {
    label: string,
    Icon: LucideIcon
} & ButtonHTMLAttributes<HTMLButtonElement>

export function ActionButton({ label, Icon, ...rest }: ActionButtonProps) {
    return (
        <button type="button" className="action-button" {...rest}>
            <Icon />

            <span>{label}</span>
        </button>
    )
}