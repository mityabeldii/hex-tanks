import React from 'react';
import styled, { keyframes } from 'styled-components';
import './index.css';
import tank from './assets/images/tank.png';
import moment from 'moment'

// Components
export const Container = styled.div`
   width: ${props => props.width === undefined ? 100 : props.width}${props => props.widthUnit === undefined ? `vw` : props.widthUnit};
   height: ${props => props.height === undefined ? 100 : props.height}${props => props.heightUnit === undefined ? `vh` : props.heightUnit};
   background-color: ${props => props.backgroundColor=== undefined ? `red` : props.backgroundColor};
   opacity: ${props => props.opacity};
   background-image: url(${props => props.backgroundImage});
   background-size: cover;
   border: ${props => props.borderWidth}vh solid ${props => props.borderColor === undefined ? `transparent` : props.borderColor};
   border-radius: ${props => props.borderRadius}vh;
   font-family: ${props => props.bold ? `FrutigerNeueLTW1G-Heavy sans-serif` : undefined };
   font-size: ${props => props.fontSize === undefined ? 2.3 : props.fontSize}vh;
   box-shadow: ${props => props.shadow ? `2vw 2vh 100000px rgba(0,0,0, 0.1)` : undefined};
   z-index: ${props => props.zIndex};
   display: ${props => props.scrollY === `auto` ? `block` : `flex`};
   margin: 0 auto;
   position: ${props => props.absolute ? `absolute` : `relative`};
   right: ${props => props.right}px;
   left: ${props => props.left}px;
   top: ${props => props.top}px;
   bottom: ${props => props.bottom}px;
   user-select: none;
   overflow: hidden;
   overflow-x: ${props => props.scrollX};
   overflow-y: ${props => props.scrollY};
   scroll-direction: ${props => props.scrollDirection};
   color: ${props => props.color === undefined ? 'black' : props.color};
   justify-content: ${props => props.justifyContent === undefined ? `center` : props.justifyContent};
   align-items: ${props => props.alignItems === undefined ? `center` : props.alignItems};
   flex-direction: ${props => props.scrollY === `auto` ? `column` : props.row === undefined ? `column` : `row`};
   animation: ${props => props.animation} ${props => props.animationTiming === undefined ? 0.1 : props.animationTiming}s linear;
   // ::-webkit-scrollbar { width: 0; }
   &:hover {
   opacity: ${props => props.hover};
   }
   transform: ${props => props.transform};
`;

export const Triangle = styled.div`
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 0 0 ${props => props.width / 2}px ${props => props.width * Math.sqrt(3) / 2}px;
    border-color: transparent transparent ${props => props.color} transparent;
    transform: ${props => props.transform};
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
        tank1Old: {
            from_i: 0,
            from_j: 0,
            to_i: 0,
            to_j: 0,
        },
    }

    hexSide = ((window.innerHeight * 0.9) / 12).toFixed(2) * 0.61

    getCoordinatesByIndexes = (i, j) => {
        let x = (j + 1) * Math.sqrt(3) * this.hexSide + 1 * j - this.hexSide
        let y = (1.5 * i + 1) * +this.hexSide + 1.3 * i - this.hexSide
        if (i % 2 === 0) {
            x = (j * 2 + 1) * Math.sqrt(3) * 0.5 * this.hexSide + 1 * j - this.hexSide
        }
        return ({
            x: +x.toFixed(0),
            y: +y.toFixed(0)
        })
    }

    sideBar = () => {
        return (
            <Container width={20} height={100} backgroundColor={`white`} >

            </Container>
        )
    }

    componentDidMount () {
        setTimeout(() => {
            let location = []
            for (let i = 0; i < 12; i++) {
                let row = []
                for (let j = 0; j < 12; j++) {
                    row.push({
                        disabled: false,
                        wall: false,
                    })
                }
                location.push(row)
            }
            location[3][7].disabled = true
            location[8][3].wall = true
            this.setState({location: location})
        }, 0)
    }

    hex = (x, y, color) => {
        return (
            <Container
                width={this.hexSide * Math.sqrt(3)}
                widthUnit={'px'}
                height={this.hexSide * 2}
                heightUnit={`px`}
                backgroundColor={`transparent`}
                absolute={true}
                top={y}
                left={x}
            >
                <Container
                    width={this.hexSide * Math.sqrt(3)}
                    widthUnit={'px'}
                    height={this.hexSide / 2}
                    heightUnit={`px`}
                    backgroundColor={`transparent`}
                    row={true}
                >
                    <Triangle
                        width={this.hexSide}
                        color={color}
                    />
                    <Triangle
                        width={this.hexSide}
                        color={color}
                        transform={`matrix(-1, 0, 0, 1, 0, 0)`}
                    />
                </Container>
                <Container width={this.hexSide * Math.sqrt(3)} widthUnit={`px`} height={this.hexSide} heightUnit={`px`} backgroundColor={color} />
                <Container
                    width={this.hexSide * Math.sqrt(3)}
                    widthUnit={'px'}
                    height={this.hexSide / 2}
                    heightUnit={`px`}
                    backgroundColor={`transparent`}
                    row={true}
                >
                    <Triangle
                        width={this.hexSide}
                        color={color}
                        transform={`matrix(-1, 0, 0, 1, 0, 0) rotate(180deg)`}
                    />
                    <Triangle
                        width={this.hexSide}
                        color={color}
                        transform={`rotate(180deg)`}
                    />
                </Container>
            </Container>
        )
    }

    keys= [ `w`, `e`, `d`, `x`, `z`, `a` ]
    iINC = [ - 1, - 1, 0, 1, 1, 0 ]
    jINC_0 = [ 1, 0, -1, 0, 1, 1 ]
    jINC_1 = [ 0, -1, -1, -1, 0, 1 ]
    angles = [-30, 30, 90, 150, 210, 270]

    handleKeyPress = (event) => {
        let tank1 = this.state.tank1
        let i = this.keys.indexOf(event.key.toLowerCase())
        if (i !== -1) {
            tank1 = {
                i: this.state.tank1.i + this.iINC[i],
                j: this.state.tank1.j - (this.state.tank1.i % 2 === 0 ? this.jINC_0[i] : this.jINC_1[i]),
                angle: this.angles[i]
            }
            // Если новые координаты не выходят за пределы поля, не являются стеной или вообще есть на карте - обновляем state.tank1
            if (
                ((tank1.i >= 0) && (tank1.i < 12)) &&
                ((tank1.j >= 0) && (tank1.j < 12)) &&
                (!this.state.location[tank1.i][tank1.j].disabled) &&
                (!this.state.location[tank1.i][tank1.j].wall)
            ) {
                this.setState({
                    tank1: tank1,
                    tank1Old: this.state.tank1
                })
            }
        }
        if (event.key.toLowerCase() === `s`) {

        }
    }

    render = () => {

        let animation = (fromL, toL, fromT, toT) => {
            return keyframes`
                from {
                    left: ${fromL}px;
                    top: ${fromT}px;
                }
                to {
                    left: ${toL}px;
                    top: ${toT}px;
                }
            `;
        }
        
        return (
            <Container backgroundColor={`grey`} row={true} >
                <Input type="text" value={""} onKeyPress={this.handleKeyPress} autofocus="true" />
                {this.sideBar()}
                <Container height={90} widthUnit={`vh`} backgroundColor={`grey`} >
                    {
                        this.state.location.map((row, i) => {
                            return row.map((column, j) => {
                                let coordinates = this.getCoordinatesByIndexes(i, j)
                                let color = `white`
                                if (this.state.location[i][j].wall) {
                                    color = `lightgrey`
                                }
                                if (!this.state.location[i][j].disabled) {
                                    return this.hex(coordinates.x, coordinates.y, color)
                                } else {
                                    return null
                                }
                            })
                        })
                    }
                    <Container
                        width={466 / 20}
                        widthUnit={`px`}
                        height={979 / 20}
                        heightUnit={`px`}
                        backgroundColor={`trnasparent`}
                        backgroundImage={tank}
                        transform={`rotate(${this.state.tank1.angle}deg)`}
                        absolute={true}
                        left={this.getCoordinatesByIndexes(this.state.tank1.i, this.state.tank1.j).x + this.hexSide * 0.5}
                        top={this.getCoordinatesByIndexes(this.state.tank1.i, this.state.tank1.j).y + this.hexSide * 0.2}
                        animation={animation(
                            this.getCoordinatesByIndexes(this.state.tank1Old.i, this.state.tank1Old.j).x + this.hexSide * 0.5,
                            this.getCoordinatesByIndexes(this.state.tank1.i, this.state.tank1.j).x + this.hexSide * 0.5,
                            this.getCoordinatesByIndexes(this.state.tank1Old.i, this.state.tank1Old.j).y + this.hexSide * 0.2,
                            this.getCoordinatesByIndexes(this.state.tank1.i, this.state.tank1.j).y + this.hexSide * 0.2,
                        )}
                    >

                    </Container>
                </Container>
                {this.sideBar()}
            </Container>
        )
    }
}

export default (App)