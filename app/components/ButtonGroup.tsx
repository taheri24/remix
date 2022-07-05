import React from 'react'
export function ButtonGroup(props: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className="btn-group" {...props}>
      {props.children}
    </div>
  )
}
