import React from "react"

const ExtLink = ({ href, title, children }) => (<a href={href} title={title || children} target="_blank" rel="noopener noreferrer nofollow">{children}</a>)

export default ExtLink;