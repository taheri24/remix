import React from "react"
import { ImMinus } from "react-icons/im"


export function PartialCheckIcon(props: BoxProps) {
  return <Box boxSize="10px" as={ImMinus} color="white" {...props} />
}
