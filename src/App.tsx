import { ChangeEvent, createContext, useEffect, useState } from "react";
import ListOfCategories from "./components/ListOfCategories";
import CreateNew from "./components/CreateNew";
import Profile from "./components/Profile";
import Register from "./auth/components/Register";
import Login from "./auth/components/Login";
import { loadUser } from "./auth/authActions";
import "./App.css";
import { logout } from "./auth/authActions";
import { Routes, Route, Link, Navigate, useLocation } from "react-router-dom";
import ListOfQuestions from "./components/ListOfQuestions";
import Quizz from "./components/Quizz";

export const ConfigContext = createContext(null as any);

export interface User {
  _id: string;
  username: string;
  likedQuestions: string[],
  bookmarkedCategories: string[]
}

export interface Category {
  _id: string;
  label: string;
}

export interface QuestionCard {
  _id: string;
  label: string;
  author: User;
  category: Category;
  answers: string[];
}

export let url = '/api/';

if (process.env.NODE_ENV === 'production'){
    url = 'https://emmanuelpaatz.com/guesswords/api/';
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null as User | null);
  const [questions, setQuestions] = useState([] as QuestionCard[]);
  const [categories, setCategories] = useState([] as Category[]);
  const [currentCategory, setCurrentCategory] = useState(null as Category | null);
  const [searchFilter, setSearchFilter] = useState('');
  let location = useLocation();

  const classNameSideMenuIcon = (path: string) => {
    if (location.pathname === path) {
      return "leftSideMenu-icon-selected";
    } else {
      return "leftSideMenu-icon";
    }
  };
  
  useEffect(() => {
    if (!isAuthenticated) loadUser(setUser, setIsAuthenticated);
  }, []);
 
    return (
      <ConfigContext.Provider value={{searchFilter, user, setUser, questions, setQuestions, categories, setCategories, currentCategory, setCurrentCategory}}>
      <div id="container">
        <div id="navbar">
          {!isAuthenticated && location? ( //TODO: Find a better way to change className based on url
            <Routes>
              <Route path="/guesswords/login"
                element={<Link className="navButton" to="/guesswords/register">
                  Register
                </Link>}
              />
              <Route path="/guesswords/register"
                element={<Link className="navButton" to="/guesswords/login">
                  Login
                </Link>}
              />
              <Route path="/guesswords/" element={<Navigate to="/guesswords/login" replace/>} />
            </Routes>
          ) : (
            <>
              <div id="searchArea">
                <input 
                  id="searchAreaInput" 
                  type="text"
                   placeholder="Search..."
                  onChange={(e : ChangeEvent<HTMLInputElement>) => {
                   setSearchFilter(e.target.value);
                  }}
                  value={searchFilter}
                />
              </div>
              <div id="nameLabel">{user?.username}</div>
              <Link to="/guesswords/profile">
                <div id="avatar-icon"></div>
              </Link>
              {isAuthenticated ? (
                <div className="navButton" onClick={logout}>
                  Logout
                </div>
              ) : (
                <div className="navButton" onClick={logout}>
                  Login
                </div>
              )}
            </>
          )}
        </div>
        <div id="leftSideMenu">
          {isAuthenticated ? (
            <div>
              <Link to="/guesswords/play">
                <div className={classNameSideMenuIcon("/guesswords/play")}> 
                  <div id="play-icon"></div> 
                </div>
              </Link>
              <Link to="/guesswords/add">
                <div className={classNameSideMenuIcon("/guesswords/add")}>
                  <div id="add-icon"></div>
                </div>
              </Link>
            </div>
          ) : null}
        </div>
        <div id="mainPannel">
          <div id="mainArea">
            <Routes>
              <Route 
                path="/guesswords/register"
                element={<Register isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} setUser={setUser} />}
              />
              <Route 
                path="/guesswords/login" 
                element={<Login isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} setUser={setUser}/>} />
              
              <Route
                path="/guesswords/play"
                element={isAuthenticated ? <ListOfCategories /> : <Login isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} setUser={setUser}/>}>
                  
              </Route> 
              <Route
                    path="/guesswords/play/:categoryId"
                    element={isAuthenticated ? <ListOfQuestions /> : <Login isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} setUser={setUser}/>}/>
                    <Route
                    path="/guesswords/play/question/:questionId"
                    element={isAuthenticated ? <Quizz /> : <Login isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} setUser={setUser}/>}/>
              <Route
                path="/guesswords/add"
                element={isAuthenticated ? <CreateNew /> : <Login isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} setUser={setUser}/>}
              />
               <Route
                path="/guesswords/profile"
                element={isAuthenticated ? <Profile /> : <Login isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} setUser={setUser}/>}
              />
            </Routes>
          </div>
        </div>
      </div>
      </ConfigContext.Provider>
    );
}

export default App;
