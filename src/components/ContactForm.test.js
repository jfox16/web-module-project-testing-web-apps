import React from 'react';
import {render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ContactForm from './ContactForm';

const setup = () => {
  const utils = render(<ContactForm />);
  const header = utils.getByText(/contact form/i);
  const firstNameInput = utils.getByLabelText(/first name/i);
  const lastNameInput = utils.getByLabelText(/last name/i);
  const emailInput = utils.getByLabelText(/email/i);
  const messageInput = utils.getByLabelText(/message/i);
  const submit = document.querySelector('input[type=submit]');

  return {
    header,
    firstNameInput,
    lastNameInput,
    emailInput,
    messageInput,
    submit,
    ...utils
  }
}

const queryAllErrors = () => {
  return screen.queryAllByTestId('error');
}

test('renders without errors', ()=>{
  setup();
});

test('renders the contact form header', ()=> {
  const { header } = setup();
  expect(header).toBeInTheDocument();
});

test('renders ONE error message if user enters less then 5 characters into firstname.', async () => {
  const { firstNameInput } = setup();
  expect(firstNameInput).toBeInTheDocument();
  fireEvent.change(firstNameInput, { target: { value: 'abcd' } });
  const errors = queryAllErrors();
  expect(errors.length).toEqual(1);
});

test('renders THREE error messages if user enters no values into any fields.', async () => {
  const { submit } = setup();
  submit.click();
  const errors = queryAllErrors();
  expect(errors.length).toEqual(3);
});

test('renders ONE error message if user enters a valid first name and last name but no email.', async () => {
  const { firstNameInput, lastNameInput, submit } = setup();
  fireEvent.change(firstNameInput, { target: { value: 'Jonathan' } });
  fireEvent.change(lastNameInput, { target: { value: 'Fox' } });
  submit.click();
  const errors = queryAllErrors();
  expect(errors.length).toEqual(1);
});

test('renders "email must be a valid email address" if an invalid email is entered', async () => {
  const { emailInput } = setup();
  fireEvent.change(emailInput, { target: { value: 'myNameIsJon' } });
  screen.getByText(/email must be a valid email address/i);
});

test('renders "lastName is a required field" if an last name is not entered and the submit button is clicked', async () => {
  const { submit } = setup();
  submit.click();
  screen.getByText(/lastName is a required field/i);
});

test('renders all firstName, lastName and email text when submitted. Does NOT render message if message is not submitted.', async () => {
  const { firstNameInput, lastNameInput, emailInput, submit } = setup();
  fireEvent.change(firstNameInput, { target: { value: 'Jonathan' } });
  fireEvent.change(lastNameInput, { target: { value: 'Fox' } });
  fireEvent.change(emailInput, { target: { value: 'myNameIsJon@jon.com' } });
  submit.click();
  expect(screen.getByTestId('firstnameDisplay')).toHaveTextContent('Jonathan');
  expect(screen.getByTestId('lastnameDisplay')).toHaveTextContent('Fox');
  expect(screen.getByTestId('emailDisplay')).toHaveTextContent('myNameIsJon@jon.com');
  expect(screen.queryByTestId('messageDisplay')).toBeNull();
});

test('renders all fields text when all fields are submitted.', async () => {
  const { firstNameInput, lastNameInput, emailInput, messageInput, submit } = setup();
  fireEvent.change(firstNameInput, { target: { value: 'Jonathan' } });
  fireEvent.change(lastNameInput, { target: { value: 'Fox' } });
  fireEvent.change(emailInput, { target: { value: 'myNameIsJon@jon.com' } });
  fireEvent.change(messageInput, { target: { value: 'I really hope my Contact Form is working correctly!' } });
  submit.click();
  expect(screen.getByTestId('firstnameDisplay')).toHaveTextContent('Jonathan');
  expect(screen.getByTestId('lastnameDisplay')).toHaveTextContent('Fox');
  expect(screen.getByTestId('emailDisplay')).toHaveTextContent('myNameIsJon@jon.com');
  expect(screen.getByTestId('messageDisplay')).toHaveTextContent('I really hope my Contact Form is working correctly!');
});