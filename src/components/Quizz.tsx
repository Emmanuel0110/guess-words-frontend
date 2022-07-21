
import { useContext, useMemo, useState } from 'react';
import { Form, ListGroup } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';
import { Link, useParams } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import { Category, ConfigContext, QuestionCard } from '../App';
import { computeNewAnswer, submitAnswer } from './functions';

export interface Result {
  success: boolean;
  answer: string;
  index: number;
  newIndex: number;
  answerCount: number;
  totalAnswer: number;
}

function Quizz() {
  const { questions, currentCategory}: {questions: QuestionCard[], currentCategory: Category} = useContext(ConfigContext);
  const [answers, setAnswers] = useState([
    {value:"", frequency: 0},
    {value:"", frequency: 0},
    {value:"", frequency: 0},
    {value:"", frequency: 0},
    {value:"", frequency: 0},
  ])
  const [answer, setAnswer] = useState("");
  const {questionId} = useParams();

  let question: QuestionCard = useMemo(() => {
    return {...questions.find(question => question._id === questionId)!, answers: ["","","","",""]};
  }, [questionId]);
  const onSubmit = () => {
    submitAnswer(answer, questionId!).then((result: Result) => {
      setAnswers(answers => computeNewAnswer(answers, result));
      setAnswer("");
    });
  }

  return <div id="quizz">
    <div style={{margin: '10px'}}><Link to={'/play/' + currentCategory._id}>{"Back to " + currentCategory.label}</Link></div>
    {question ? <Card style={{ width: '30rem', margin: '20px auto'}}>
    <Card.Body>
      <Card.Title>{question.label}</Card.Title>
      <Card.Subtitle className="mb-2 text-muted">{"By " + question.author.username}</Card.Subtitle>
    </Card.Body>
    <ListGroup className="list-group-flush">
      {answers.map((answer, index) => <ListGroup.Item key={index}>
        <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', height: '100%', alignItems: 'center'}}>
          <div>{answer.value}</div>
          <div>{answer.frequency ? (Math.round(answer.frequency * 100) + "%") : ""}</div>
        </div>
      </ListGroup.Item>)}
    </ListGroup>
    <Card.Footer style={{display: 'flex', justifyContent: 'space-between'}}>
      <Form.Control style={{width: '20rem'}} id="answer" name="answer" value={answer} type="text" placeholder="Type your answer..." onChange={e => setAnswer((e.target as HTMLInputElement).value)}/>
      <Button style={{height: '100%'}} onClick={onSubmit}>Submit</Button>
    </Card.Footer>
  </Card> : null}
  </div>
}

export default Quizz;


    