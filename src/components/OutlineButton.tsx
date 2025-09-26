import type { LucideIcon } from 'lucide-react'
import type { ButtonHTMLAttributes } from 'react'
import '../styles/components/outline-button.css'

export type OutlineButtonProps = {
    label: string,
    Icon: LucideIcon
} & ButtonHTMLAttributes<HTMLButtonElement>

export function OutlineButton({ Icon, label, ...rest }: OutlineButtonProps) {
    return (
        <button type="button" className="outline-button" {...rest}>
            <div>
                <Icon />

                <span>{label}</span>
            </div>
        </button>
    )
}