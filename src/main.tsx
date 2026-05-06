import ReactDOM from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import { CssBaseline, ThemeProvider } from "@mui/material"
import { StyledEngineProvider } from "@mui/material/styles"
import App from "@/App"
import { appTheme } from "@/theme"
import "@fontsource/roboto/300.css"
import "@fontsource/roboto/400.css"
import "@fontsource/roboto/500.css"
import "@fontsource/roboto/700.css"
import "./index.css"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <StyledEngineProvider injectFirst>
    <ThemeProvider theme={appTheme}>
      <CssBaseline />
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </StyledEngineProvider>
)
