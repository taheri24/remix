import * as React from "react"


export const Limiter: React.FC<BoxProps> = (props) => {
  const px = {
    base: 4,
    md: 10,
    lg: 24,
    xl: 60,
  }
  return <Box w="100%" px={px} {...props} />
}
