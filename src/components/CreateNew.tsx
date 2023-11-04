import React, { useState } from 'react';
import { submitQuestion } from './functions';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useContext } from "react";
import { ConfigContext } from '../App';

function CreateNew() {
  const { user: {_id: authorId}} = useContext(ConfigContext);
  const [label, setLabel] = useState("");
  const [category, setcategory] = useState("");
  const [answer_1, setAnswer_1] = useState("");
  const [answer_2, setAnswer_2] = useState("");
  const [answer_3, setAnswer_3] = useState("");
  const [answer_4, setAnswer_4] = useState("");
  const [answer_5, setAnswer_5] = useState("");

  const resetFields = () => {
    setLabel("");
    setcategory("");
    setAnswer_1("");
    setAnswer_2("");
    setAnswer_3("");
    setAnswer_4("");
    setAnswer_5("");
  }

  const onSubmit = (e: React.MouseEvent) =>{
      e.preventDefault();
      if (label && category && answer_1 &&  answer_2 && answer_3 && answer_4 && answer_5) {
        submitQuestion({label, authorId, category, answers: [answer_1, answer_2, answer_3, answer_4, answer_5]})
      } else {
        alert("All the fields must be filled");
      }
      resetFields();
  }

        
  return <Form id="createNewForm">
              <Form.Group>
                  <Form.Label>Title</Form.Label>
                  <Form.Control id="label" name="label" type="text" onChange={e => setLabel((e.target as HTMLInputElement).value)} value={label}/>
              </Form.Group>
              <Form.Group>
                  <Form.Label>Category</Form.Label>
                  <Form.Control id="category" name="category" type="text" onChange={e => setcategory((e.target as HTMLInputElement).value)} value={category}/>
              </Form.Group>
              <Form.Group>
                  <Form.Label>Answers</Form.Label>
                  <Form.Control id="answer_1" name="answer_1" type="text" placeholder='Proposition 1' onChange={e => setAnswer_1((e.target as HTMLInputElement).value)} value={answer_1}/>
                  <Form.Control id="answer_2" name="answer_2" type="text" placeholder='Proposition 2' onChange={e => setAnswer_2((e.target as HTMLInputElement).value)} value={answer_2}/>
                  <Form.Control id="answer_3" name="answer_3" type="text" placeholder='Proposition 3' onChange={e => setAnswer_3((e.target as HTMLInputElement).value)} value={answer_3}/>
                  <Form.Control id="answer_4" name="answer_4" type="text" placeholder='Proposition 4' onChange={e => setAnswer_4((e.target as HTMLInputElement).value)} value={answer_4}/>
                  <Form.Control id="answer_5" name="answer_5" type="text" placeholder='Proposition 5' onChange={e => setAnswer_5((e.target as HTMLInputElement).value)} value={answer_5}/>
              </Form.Group>
              <Button onClick={onSubmit}>Submit</Button>
          </Form>
}

export default CreateNew;