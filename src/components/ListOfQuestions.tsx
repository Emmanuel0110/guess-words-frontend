import { useContext, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import { Link, useParams } from 'react-router-dom';
import { Category, ConfigContext, QuestionCard, User } from '../App';
import { fetchCategoryById, fetchQuestions, updateRemoteUser } from './functions';
import { bookmark, bookmarkClass } from './ListOfCategories';

function ListOfQuestions() {
  const {searchFilter, user, setUser, questions, setQuestions, categories, currentCategory, setCurrentCategory}: {searchFilter: string, user: User, setUser:any , questions: QuestionCard[], setQuestions: any, categories: Category[], currentCategory: Category, setCurrentCategory: any} = useContext(ConfigContext);
  const {categoryId} = useParams();
  useEffect(() => {
    if(currentCategory?._id !== categoryId) {
      const fetchCategory = async () => categories.length ? 
          categories.find(category => category._id === categoryId)
        : await fetchCategoryById(categoryId!);
      fetchCategory().then((category: Category) => {if(category) setCurrentCategory(category)});
      fetchQuestions(categoryId!).then((questions: QuestionCard[]) => {if(questions) setQuestions(questions)});
    }
  }, [])

  const like = (question: QuestionCard) => {
    updateRemoteUser(user._id, {likedQuestion: question._id});
    setUser((user: User) => {
      let newLikedQuestions = user.likedQuestions.includes(question._id) ?
        [...user.likedQuestions].filter(element => element !== question._id)
      : [...user.likedQuestions, question._id];
      return {...user, likedQuestions: newLikedQuestions}
    });
  }

  return ((currentCategory?._id === categoryId) && questions.length ? <div id='listOfQuestions'>
    <div id="categoryHeader">
          <Card style={{ width: '20rem', height: '12rem', margin: '10px'}}>
            <Card.Body className={"odd-index-color"} style={{height: '100%', display: 'flex', alignItems: 'flex-end'}}>
              <Card.Title style={{fontSize: '30px', color: 'white'}}>{currentCategory.label}</Card.Title>
            </Card.Body>
            <Card.Footer style={{ backgroundColor: 'white', display: 'flex', flexDirection: 'row', justifyContent: 'flex-end'}}><div className={bookmarkClass(user, currentCategory)} onClick={e => bookmark(currentCategory, user, setUser)}></div></Card.Footer>
          </Card>
    </div>
    <div id="questionCards">
    {questions.filter(question => searchFilter === "" || question.label.includes(searchFilter)).map((question,index) => {
        const likeClass = user.likedQuestions.includes(question._id) ? "heart liked" : "heart";
        return (
          <Card key={index} style={{ width: '10rem', height: '10rem', margin: '10px'}}>
            <Link to={"/guesswords/play/question/" + question._id} style={{ height: '100%', textDecoration: 'none', color: 'white'}}>
            <Card.Body style={{height: '100%', display: 'flex', alignItems: 'flex-end', backgroundColor: 'white', color: 'black'}}>
              <Card.Title style={{fontSize: '15px', textDecoration: 'none'}}>{question.label}</Card.Title>
            </Card.Body>
            </Link>
            <Card.Footer style={{ backgroundColor: 'white', display: 'flex', flexDirection: 'row', justifyContent: 'flex-end'}}><div className={likeClass} onClick={e => like(question)}></div></Card.Footer>
          </Card>
        );
      })}
    </div>
  </div> : null)
}

export default ListOfQuestions;
