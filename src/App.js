import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "./screens/Home";
import Login from "./screens/Login";
import { useReactiveVar } from "@apollo/client/react/hooks";
import { client, darkModeVar, isLoggedInVar } from "./apollo";
import { ThemeProvider } from "styled-components";
import { GlobalStyles, darkTheme, lightTheme } from "./screens/styles";
import Notfound from "./screens/Notfound";
import Signup from "./screens/Signup";
import routes from "./routes";
import { HelmetProvider } from "react-helmet-async";
import { ApolloProvider } from "@apollo/client";

function App() {
  const isLoggedIn = useReactiveVar(isLoggedInVar);
  const darkMode = useReactiveVar(darkModeVar);
  return (
    <ApolloProvider client={client}>
      <HelmetProvider>
        <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
          <GlobalStyles />
          <div>
            <Router>
              <Switch>
                <Route path={routes.home} exact>
                  {isLoggedIn ? <Home /> : <Login />}
                </Route>
                {!isLoggedIn ? (
                  <Route path={routes.signUp}>
                    <Signup />
                  </Route>
                ) : null}
                <Route>
                  <Notfound />
                </Route>
              </Switch>
            </Router>
          </div>
        </ThemeProvider>
      </HelmetProvider>
    </ApolloProvider>
  );
}

export default App;