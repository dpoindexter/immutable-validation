import React from 'react';

function Validatable (validator, contentsOrComponent) {
    return class extends React.Component {
        render () {
            const { data, shouldShowMessages } = this.props;
            const validationResult = validator.validate(data);

            const props = {
                data,
                shouldShowMessages,
                validation: validationResult.get('messages')
            };

            return (
                <form>
                    {contentsOrComponent(props)}
                </form>
            );
        }
    };
}

export default Validatable;