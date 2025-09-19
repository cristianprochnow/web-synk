import type { PropsWithChildren } from 'react'
import '../styles/components/page-title.css'

export function PageTitle(props: PropsWithChildren) {
    return (
        <h1 className="page-title">{props.children}</h1>
    )
}