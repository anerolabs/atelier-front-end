import React from 'react';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { configure, shallow, render } from 'enzyme';
import initialState from './questionTestData.js'
import QuestionsAnswers from '../src/components/questions/QuestionsAnswers.jsx';
import SearchBar from '../src/components/questions/SearchBar.jsx';

configure({ adapter: new Adapter() });

const productId = 39333;

const questionsAnswersShallow = shallow(<QuestionsAnswers key={`${productId}-3`} productId={productId} />);
const questionsAnswersInstance = questionsAnswersShallow.instance();

const searchBarShallow = shallow(<SearchBar filterQuestionsList={QuestionsAnswers.filterQuestionsList} />);
const searchBarInstance = searchBarShallow.instance();



// Parent component
test('questionsAnswersInstance is a class of QuestionsAnswers', () => {
  expect(questionsAnswersInstance).toBeInstanceOf(QuestionsAnswers);
})

test('questionAnswers setState should match our initial state ', () => {
  questionsAnswersShallow.setState(initialState)
  expect(questionsAnswersShallow.state()).toEqual(initialState)
})

test('questionsAnswersShallow should have a search bar', () => {
  expect(questionsAnswersShallow.exists('SearchBar')).toBe(true);
});

test('questionAnswersInstance.filterQuestions should add isVisible property', () => {
  questionsAnswersShallow.filterQuestionsList = questionsAnswersInstance.filterQuestionsList;
  questionsAnswersShallow.filterQuestionsList('how')
  const doesEveryQuestionHaveIsVisible = questionsAnswersShallow.state('questionsList').every((question) => {
    return (question.isVisible !== undefined) ? true : false
  })
  expect(doesEveryQuestionHaveIsVisible).toBe(true);
});

test.todo('Should filter results after three characters');


//TODO
test.todo('Should have questions list component');

test('questionsAnswersShallow should have an load more questions button', () => {
  expect(questionsAnswersShallow.exists('#load-question-button')).toBe(true);
})

test('questionsAnswersShallow should have an add a questions button', () => {
  expect(questionsAnswersShallow.exists('#add-question-button')).toBe(true);
})

//search bar

test('searchBarShallow should have an input with placeholder text', () => {
  expect(searchBarShallow.exists('#search-input')).toBe(true);
});


test.todo('filterQuestionsList should filter by the input search term');

//questionsListCompg
test.todo('should have an add answer button');
