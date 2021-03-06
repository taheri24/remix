

import { Button } from "./components/Button"
import { Input } from "./components/Input"
import { Select } from "./components/Select"
import { Textarea } from "./components/Textarea"

export const theme = extendTheme({
  config: {
    useSystemColorMode: false,
    initialColorMode: "light",
  },
  fonts: {
    body: "Poppins, sans-serif",
    heading: "Poppins, serif",
  },
  components: {
    Button,
    Input,
    FormLabel: {
      baseStyle: { mb: 0 },
    },
    FormError: {
      parts: ["text", "icon"],
      baseStyle: { text: { mt: 1 } },
    },
    Select,
    Textarea,
  },
})
