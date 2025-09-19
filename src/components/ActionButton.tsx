import type { LucideIcon } from 'lucide-react'
import type { ButtonHTMLAttributes } from 'react'
import '../styles/components/action-button.css'

export type ActionButtonProps = {
    label: string,
    Icon: LucideIcon
} & ButtonHTMLAttributes<HTMLButtonElement>

export function ActionButton(props: ActionButtonProps) {
    return (
        <button type="button" className="action-button" {...props}>
            <props.Icon />

            <span>{props.label}</span>
        </button>
    )
}