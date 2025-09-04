import type { LucideIcon } from 'lucide-react'
import { Link, type LinkProps } from 'react-router'
import '../styles/components/menu-item.css'

export type MenuItemProps = {
    Icon: LucideIcon,
    label: string,
    isActive: boolean
} & LinkProps

export function MenuItem({ Icon, label, isActive, ...rest }: MenuItemProps) {
    return (
        <Link className={`menu-item ${isActive ? 'active' : ''}`} {...rest}>
            <div className="icon-container">
                <span className="icon">
                    <Icon />
                </span>
                <span className="description">{label}</span>
            </div>
            <span className="label">{label}</span>
        </Link>
    )
}