
import React, { useContext, useMemo, useState } from 'react';
import { Form, ListGroup } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';
import { Link, useParams } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import { Category, ConfigContext, QuestionCard } from '../App';
import { computeNewAnswer, firstCapital, submitAnswer } from './functions';

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
  const [score, setScore] = useState(0);
  const [missedTrials, setMissedTrials] = useState([] as string[]);
  
  const {questionId} = useParams();

  let question: QuestionCard = useMemo(() => { // TODO: question in state ? or as argument ?
    return {...questions.find(question => question._id === questionId)!, answers: ["","","","",""]};
  }, [questionId]);

  const submit = () => {
    if (missedTrials.includes(answer) || answers.map(answer => answer.value).includes(answer)) {
      alert("Already tried");
    } else {
      submitAnswer(answer, questionId!).then((result: Result) => {
        setAnswers(answers => computeNewAnswer(answers, result));
        setAnswer("");
        if (!result.success){
          setMissedTrials([...missedTrials, answer]);
        } else {
          setScore(score => score + 100*(result.answerCount / result.totalAnswer));
        }
      });
    }
  }

  const final: boolean = useMemo(() => missedTrials.length >= 3, [missedTrials]);

  const handleKeyPress = (target: React.KeyboardEvent) => {
    if(target.key=='Enter') submit();
  }

  return <div id="quizz">
    <div style={{margin: '10px'}}><Link to={'/guesswords/play/' + currentCategory._id}>{"Back to " + currentCategory.label}</Link></div>
   
      {question ?  <div style={{ width: '40rem', margin: '20px auto', display:'flex', flexDirection:'row'}}>
        <Card style={{ width: '30rem'}}>
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
          <Card.Footer style={{display: final ? 'none' : 'flex', justifyContent: 'space-between'}}>
            <Form.Control 
              style={{width: '18rem'}}
              id="answer" name="answer"
              value={answer}
              type="text"
              placeholder="Type your answer..."
              onKeyPress={handleKeyPress}
              onChange={e => setAnswer(firstCapital((e.target as HTMLInputElement).value))}/>
            <Button style={{height: '100%'}} onClick={submit}>Submit</Button>
            <input type="submit" hidden />
          </Card.Footer>
        </Card>
        <div style={{ width: '10rem', margin: '30px'}}>
          <div style={{ marginBottom: '10px'}}>{`Score : ${score}`}</div>
          <div id="missedTrials" style={{display: 'flex', flexDirection: 'column'}}>
            {missedTrials.map((trial, index) => <div key={index}><span className='cancel-icon'></span>{trial}</div>)}
          </div>
        </div>
      </div> : null}
  </div>
}

export default Quizz;


    