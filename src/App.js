import React from 'react';
import styled, { keyframes } from 'styled-components';

const Dot = styled.div`
    width: ${props => props.radius}vh;
    height: ${props => props.radius}vh;
    background-color: black;
    border-radius: ${props => props.radius}vh;;
    position: absolute;
    left: ${props => props.x}px;
    top: ${props => props.y}px;
`;

const Tank = styled.div`
    width: ${props => props.radius}vh;
    height: ${props => props.radius}vh;
    background-color: red;
    border-radius: ${props => props.radius / 6}vh;
    transform: rotate(${props => props.angle}deg);
    position: absolute;
    left: ${props => props.x}px;
    top: ${props => props.y}px;
    z-index: 1;
`;

const Shot = styled.div`
    width: ${props => props.radius}vh;
    height: ${props => props.radius}vh;
    background-color: yellow;
    border-radius: ${props => props.radius / 6}vh;
    transform: rotate(${props => props.angle}deg);
    position: absolute;
    left: ${props => props.x}px;
    top: ${props => props.y}px;
    z-index: 1;
`;

const Body = styled.div`
    width: 100vh;
    height: 100vh;
    background-color: transparent;
    position: relative;
`;

const Input = styled.input`
    width: 100vw;
    height: 100vh;
    top: 0;
    left: 0;
    background-color: transparent;
    position: absolute;
    z-index: 10;
`;

class App extends React.Component {

    state = {
        location: [],
        tank1: {
            i: 5,
            j: 5,
            angle: 30,
            health: 2,
        },
        tank2: {
            i: 10,
            j: 10,
            angle: 30,
            health: 2,
        },
        shots: [],
        winner: undefined,
    }

    moveShot = () => {
        let shots = []
        for (let i in this.state.shots) {
            let newShot = {
                ...this.state.shots[i],
                i: this.state.shots[i].i + 1,
                j: this.state.shots[i].j + 1,
            }
            if ((newShot.i === this.state.tank2.i) && (newShot.j === this.state.tank2.j)) {
                this.setState({
                    tank2: {
                        ...this.state.tank2,
                        health: this.state.tank2.health - 1
                    }
                })
                if (this.state.tank2.health === 0) {
                    this.setState({winner: newShot.player})
                }
            }
            if ((newShot.i <= 10) && (newShot.j <= 10)) {
                shots.push(newShot)
            }
        }
        this.setState({shots: shots})
        setTimeout(() => {this.moveShot()}, 1000 / 3)
    }

    componentDidMount () {
        setTimeout(() => {
            let location = []
            for (let i = 0; i < 10; i++) {
                let row = []
                for (let j = 0; j < 10; j++) {
                    row.push(j)
                }
                location.push(row)
            }
            this.setState({location: location})
        }, 0)
        this.moveShot()
    }

    hexSide = 40

    getCoordinatesByIndexes = (i, j) => {
        let x = (j + 1) * Math.sqrt(3) * this.hexSide
        let y = (1.5 * i + 1) * +this.hexSide
        // console.log(i, j, x, y)
        if (i % 2 === 0) {
            x = (j * 2 + 1) * Math.sqrt(3) * 0.5 * this.hexSide
        }
        return ({
            x: x,
            y: y
        })
    }

    handleKeyPress = (event) => {
            if (event.key.toLowerCase() === 'w') {
                this.setState({
                    tank1: {
                        i: this.state.tank1.i - 1,
                        j: this.state.tank1.j - (this.state.tank1.i % 2 === 0 ? 1 : 0),
                        angle: -30
                    }
                })
            }
            if (event.key.toLowerCase() === 'e') {
                this.setState({
                    tank1: {
                        i: this.state.tank1.i - 1,
                        j: this.state.tank1.j + (this.state.tank1.i % 2 === 0 ? 0 : 1),
                        angle: 30
                    }
                })
            }
            if (event.key.toLowerCase() === 'd') {
                this.setState({
                    tank1: {
                        i: this.state.tank1.i,
                        j: this.state.tank1.j + 1,
                        angle: 90
                    }
                })
            }
            if (event.key.toLowerCase() === 'x') {
                this.setState({
                    tank1: {
                        i: this.state.tank1.i + 1,
                        j: this.state.tank1.j + (this.state.tank1.i % 2 === 0 ? 0 : 1),
                        angle: 150
                    }
                })
            }
            if (event.key.toLowerCase() === 'z') {
                this.setState({
                    tank1: {
                        i: this.state.tank1.i + 1,
                        j: this.state.tank1.j - (this.state.tank1.i % 2 === 0 ? 1 : 0),
                        angle: 210
                    }
                })
            }
            if (event.key.toLowerCase() === 'a') {
                this.setState({
                    tank1: {
                        i: this.state.tank1.i,
                        j: this.state.tank1.j - 1,
                        angle: 270
                    }
                })
            }
            if (event.key.toLowerCase() === 's') {
                let shots = this.state.shots
                shots.push({
                    // id: this.state.lastShotIndex,
                    player: 0,
                    angle: this.state.tank1.angle,
                    i: this.state.tank1.i,
                    j: this.state.tank1.j,
                })
                this.setState({
                    shots: shots,
                })
            }
    }

    render = () => {
        
        console.log(this.state.tank2.health)

        return (
            <Body>
                <Input type="text" value={""} onKeyPress={this.handleKeyPress} autofocus="true" />
                {
                    this.state.winner === undefined ?
                        <div>
                            {
                                this.state.location.map((row, i) => {
                                    return row.map((column, j) => {
                                        let coordinates = this.getCoordinatesByIndexes(i, j)
                                        return (
                                            <Dot
                                                x={coordinates.x}
                                                y={coordinates.y}
                                                radius={this.hexSide / 30}
                                                key={row + ' ' + column}
                                            />
                                        )
                                    })
                                })
                            }
                            <Tank
                                x={this.getCoordinatesByIndexes(this.state.tank1.i, this.state.tank1.j).x}
                                y={this.getCoordinatesByIndexes(this.state.tank1.i, this.state.tank1.j).y}
                                radius={this.hexSide / 6}
                                angle={this.state.tank1.angle}
                            >
                                A1
                            </Tank>
                            <Tank
                                x={this.getCoordinatesByIndexes(this.state.tank2.i, this.state.tank2.j).x}
                                y={this.getCoordinatesByIndexes(this.state.tank2.i, this.state.tank2.j).y}
                                radius={this.hexSide / 6}
                                angle={this.state.tank2.angle}
                            >
                                {this.state.tank2.health}
                            </Tank>
                            {
                                this.state.shots.map((item, index) => {
                                    return (
                                        <Shot
                                            x={this.getCoordinatesByIndexes(item.i, item.j).x}
                                            y={this.getCoordinatesByIndexes(item.i, item.j).y}
                                            radius={this.hexSide / 6}
                                            angle={item.angle}
                                        >
                                            B
                                        </Shot>
                                    )
                                })
                            }
                        </div> :
                        <div>winner: {this.state.winner} player</div>
                }
            </Body>
        )
    }
}

export default (App)
