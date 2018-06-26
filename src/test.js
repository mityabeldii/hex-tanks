import React from 'react';
import styled, { keyframes } from 'styled-components';

class App extends React.Component {

    state = {
        a: false,
    }

    componentDidMount = () => {

    }

    render = () => {
        return (
            <Container width={100} height={100} backgroundColor={mvConsts.colors.white} >
                App
            </Container>
        )
    }
}

export default (App)