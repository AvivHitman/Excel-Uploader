import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserSelection } from './pages/userSelection/UserSelection'
import { FileUploader } from "./pages/fileUploader/FileUploader";
import { createTheme, ThemeProvider } from "@mui/material";
import { Provider } from "react-redux";
import store from "./store";


const THEME = createTheme({
  typography: {
    "fontFamily": `"Verdana", sans-serif`,
    "fontSize": 10,
  }
});

function App() {
  return (
    <ThemeProvider theme={THEME}>
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path={'/'} element={<UserSelection />} />
            <Route path={'/uploadFile/:id'} element={<FileUploader />} />
          </Routes>
        </BrowserRouter>
      </Provider>

    </ThemeProvider>
  );
}

export default App;
