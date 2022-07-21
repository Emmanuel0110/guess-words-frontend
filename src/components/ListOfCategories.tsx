import { useContext, useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';
import { Category, ConfigContext, User } from '../App';
import { fetchCategories, updateRemoteUser } from './functions';

export const bookmark = (category: Category, user: User, setUser: any) => {
  updateRemoteUser(user._id, {bookmarkedCategory: category._id});
  setUser((user: User) => {
    let newBookmarkedCategories = user.bookmarkedCategories.includes(category._id) ?
      [...user.bookmarkedCategories].filter(element => element !== category._id)
    : [...user.bookmarkedCategories, category._id];
    return {...user, bookmarkedCategories: newBookmarkedCategories}
  });
}

export const bookmarkClass = (user: User, category: Category) => {
  return user.bookmarkedCategories.includes(category._id) ? "bookmark bookmarked" : "bookmark";
}


function ListOfCategories() {
  const {searchFilter, user, setUser, categories, setCategories}: {searchFilter: string, user: User, setUser: any, categories: Category[], setCategories: any} = useContext(ConfigContext);
  useEffect(() => {
    if(!categories.length) {
      fetchCategories().then(categories => {if(categories) setCategories(categories)});
    }
  }, [])
  return <div id='listOfCategories'>
    <div id="bookmarkedCategories">
      {categories.filter(category => (searchFilter === "" || category.label.includes(searchFilter)) && user.bookmarkedCategories.includes(category._id)).map((category,index) => {
        return (
          <Card key={index} style={{ width: '20rem', height: '12rem', margin: '10px'}}>
            <Link to={category._id} style={{ height: '100%', textDecoration: 'none', color: 'white'}}>
            <Card.Body className={isEven(index) ? "even-index-color" : "odd-index-color"} style={{height: '100%', display: 'flex', alignItems: 'flex-end'}}>
              <Card.Title style={{fontSize: '30px', textDecoration: 'none'}}>{category.label}</Card.Title>
            </Card.Body>
            </Link>
            <Card.Footer style={{ backgroundColor: 'white', display: 'flex', flexDirection: 'row', justifyContent: 'flex-end'}}><div className={bookmarkClass(user, category)} onClick={e => bookmark(category, user, setUser)}></div></Card.Footer>
          </Card>
        );
      })}
    </div>
    <div id="otherCategories">
    {categories.filter(category => (searchFilter === "" || category.label.includes(searchFilter)) && !user.bookmarkedCategories.includes(category._id)).map((category,index) => {
        const bookmarkClass = user.bookmarkedCategories.includes(category._id) ? "bookmark bookmarked" : "bookmark";
        return (
          <Card key={index} style={{ width: '10rem', height: '10rem', margin: '10px'}}>
            <Link to={category._id} style={{ height: '100%', textDecoration: 'none', color: 'white'}}>
            <Card.Body className={isEven(index) ? "even-index-color" : "odd-index-color"} style={{height: '100%', display: 'flex', alignItems: 'flex-end'}}>
              <Card.Title style={{fontSize: '15px', textDecoration: 'none'}}>{category.label}</Card.Title>
            </Card.Body>
            </Link>
            <Card.Footer style={{ backgroundColor: 'white', display: 'flex', flexDirection: 'row', justifyContent: 'flex-end'}}><div className={bookmarkClass} onClick={e => bookmark(category, user, setUser)}></div></Card.Footer>
          </Card>
        );
      })}
    </div>
  </div>
}

export default ListOfCategories;

function isEven(n: number) {
  return n === 0 || !!(n && !(n%2));
}
