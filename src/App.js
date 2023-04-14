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
import Layout from "./components/Layout";
import Profile from "./screens/Profile";
import Post from "./screens/Post";
import { exact } from "prop-types";
import Edit from "./screens/Edit";
import Explore from "./screens/Explore";

function App() {
  const isLoggedIn = useReactiveVar(isLoggedInVar);
  const darkMode = useReactiveVar(darkModeVar);
  return (
    <ApolloProvider client={client}>
      <HelmetProvider>
        <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
          <GlobalStyles />
          <Router>
            <Switch>
              <Route path={routes.home} exact>
                {isLoggedIn ? (
                  <Layout>
                    <Home />
                  </Layout>
                ) : (
                  <Login />
                )}
              </Route>
              {!isLoggedIn ? (
                <Route path={routes.signUp}>
                  <Signup />
                </Route>
              ) : null}
              <Route path={`/users/:username`} exact>
                <Layout>
                  <Profile />
                </Layout>
              </Route>
              <Route path={`/users/edit/:username`} exact>
                {isLoggedIn ? (
                  <Layout>
                    <Edit />
                  </Layout>
                ) : (
                  <Login />
                )}
              </Route>
              <Route path={"/seephotos"} exact>
                <Layout>
                  <Explore/>
                </Layout>
              </Route>
              <Route>
                <Notfound />
              </Route>
            </Switch>
          </Router>
        </ThemeProvider>
      </HelmetProvider>
    </ApolloProvider>
  );
}

export default App;
