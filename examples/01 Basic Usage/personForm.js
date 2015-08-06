import React from 'react';
import immstruct from 'immstruct';
import omniscient from 'omniscient';
import Validator from './Validator';
import rule from './rule';
import { required } from './facts';
import { Input, Validatable } from './forms';

const component = omniscient.withDefaults({
    jsx: true
});

const state = immstruct({
    person: {
        firstName: '',
        lastName: ''
    },
    shouldShowMessages: true
});

const FormsExample = component(({ stateCursor }) => {
    return (
        <div>
            <h1>Form Validation</h1>
            <PersonForm
                data={stateCursor.cursor('person')}
                shouldShowMessages={stateCursor.get('shouldShowMessages')} />
        </div>
    );
});

const firstNameRequired = rule(required, 'Please enter your first name');
const lastNameRequired = rule(required, 'Please enter your last name');

const personValidator = new Validator()
    .ruleFor('firstName', (p) => p.get('firstName'), firstNameRequired)
    .ruleFor('lastName', (p) => p.get('lastName'), lastNameRequired);

const PersonForm = Validatable(personValidator, (props) => {
    return (
        <div>
            <Input label="First Name" {...dataFor('firstName', props)} />
            <Input label="Last Name" {...dataFor('lastName', props)} />
        </div>
    );
});

function dataFor (fieldName, { data, validation, shouldShowMessages }) {
    const dataAccessor = data.cursor || data.get || (n => data[n]);
    return {
        value: dataAccessor.call(data, fieldName),
        validation: validation.get(fieldName),
        shouldShowMessages
    };
}

function render () {
    React.render(
        <FormsExample stateCursor={state.cursor()} />,
        document.getElementById('app')
    );
}

document.addEventListener('DOMContentLoaded', () => {
    render();
    state.on('swap', render);
});