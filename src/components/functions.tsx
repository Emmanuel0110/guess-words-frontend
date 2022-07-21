import { authHeaders, customFetch } from "../lib/http-helpers";
import { Category, QuestionCard, url } from '../App';
import { Result } from "./Quizz";

interface Question {
  label: string;
  authorId: string;
  category: string;
  answers: string[];
}

export const submitQuestion = ({label, authorId, category, answers}: Question) => {
  const body = JSON.stringify({label, authorId, category, answers});
  customFetch(url + 'questions', {method: 'POST', headers: authHeaders(), body})
  .then((res: any)=>res.json())
  .then((res: any)=>{
    if (!res.ok) {
      throw Error(res.msg);
    }
  }).catch((err: Error)=>{
    console.log(err);
  });
}

export const fetchCategories = () => {
  return customFetch(url + 'categories', {method: 'GET', headers: authHeaders()})
  .then((res: any)=>res.json())
  .catch((err: Error)=>{
    console.log(err);
  });
}

export const fetchQuestions = (categoryId: string) => {
  return customFetch(url + 'questions?category=' + categoryId, {method: 'GET', headers: authHeaders()})
  .then((res: any)=>res.json())
  .catch((err: Error)=>{
    console.log(err);
  });
}

export const submitAnswer = (answer: string, questionId: string) => {
  const body = JSON.stringify({answer});
  return customFetch(url + 'questions/' + questionId, {method: 'PUT', headers: authHeaders(), body})
  .then((res: any)=>res.json())
  .catch((err: Error)=>{
    console.log(err);
  });
}

export const computeNewAnswer = (answers: {value: string, frequency: number}[], {success, answer, index, newIndex, answerCount, totalAnswer}: Result) => {
  if (!success) return answers;
  let newAnswers = [...answers];
  let frequency = answerCount / totalAnswer;
  newAnswers.forEach(answer => answer.frequency *= (totalAnswer - 1) / totalAnswer);
  if (newIndex !== undefined) {
    if (index < 5) {
      newAnswers.splice(index, 1);
    }
    newAnswers.splice(newIndex, 0, {value: answer, frequency});
  } else {
    newAnswers[index].value = answer;
    newAnswers[index].frequency = frequency;
  }
  return [...newAnswers];
}

interface Parameters {
  bookmarkedCategory?: string;
  likedQuestion?: string;
}

export const updateRemoteUser = (userId: string, parameters: Parameters) => {
  customFetch(url + 'users/' + userId, {method: 'PUT', headers: authHeaders(), body: JSON.stringify(parameters)})
  .then((res: any)=>res.json())
  .then((res: any)=>{
    if (!res.ok) {
      throw Error(res.msg);
    }
  }).catch((err: Error)=>{
    console.log(err);
  });
}

export const fetchCategoryById = (categoryId: string) => {
  return customFetch(url + 'categories?id=' + categoryId, {method: 'GET', headers: authHeaders()})
  .then((res: any)=>res.json())
  .catch((err: Error)=>{
    console.log(err);
  });
}