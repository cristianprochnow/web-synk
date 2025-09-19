import type { LucideIcon } from 'lucide-react'
import type { ButtonHTMLAttributes } from 'react'
import '../styles/components/outline-button.css'

export type OutlineButtonProps = {
    label: string,
    Icon: LucideIcon
} & ButtonHTMLAttributes<HTMLButtonElement>

export function OutlineButton(props: OutlineButtonProps) {
    return (
        <button type="button" className="outline-button" {...props}>
            <div>
                <props.Icon />

                <span>{props.label}</span>
            </div>
        </button>
    )
}