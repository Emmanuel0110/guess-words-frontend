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
    url = 'https://emmanuelpaatz.com/guess-words/api/';
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
              <Route path="/login"
                element={<Link className="navButton" to="/register">
                  Register
                </Link>}
              />
              <Route path="/register"
                element={<Link className="navButton" to="/login">
                  Login
                </Link>}
              />
              <Route path="/" element={<Navigate to="/login" replace/>} />
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
              <Link to="/profile">
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
              <Link to="/play">
                <div className={classNameSideMenuIcon("/play")}> 
                  <div id="play-icon"></div> 
                </div>
              </Link>
              <Link to="/add">
                <div className={classNameSideMenuIcon("/add")}>
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
                path="/register"
                element={<Register isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} setUser={setUser} />}
              />
              <Route 
                path="/login" 
                element={<Login isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} setUser={setUser}/>} />
              
              <Route
                path="/play"
                element={isAuthenticated ? <ListOfCategories /> : <Login isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} setUser={setUser}/>}>
                  
              </Route> 
              <Route
                    path="/play/:categoryId"
                    element={isAuthenticated ? <ListOfQuestions /> : <Login isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} setUser={setUser}/>}/>
                    <Route
                    path="/play/question/:questionId"
                    element={isAuthenticated ? <Quizz /> : <Login isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} setUser={setUser}/>}/>
              <Route
                path="/add"
                element={isAuthenticated ? <CreateNew /> : <Login isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} setUser={setUser}/>}
              />
               <Route
                path="/profile"
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
