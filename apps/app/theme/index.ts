// 1. Import the extendTheme function
import { extendTheme } from "@chakra-ui/react";

const colors = {
  brand: {
    type: "#b100cd",
    state: " #ff781f",
  },
};

const theme = extendTheme({ colors });

export default theme;
