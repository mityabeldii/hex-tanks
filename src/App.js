import React from 'react';
import styled, { keyframes } from 'styled-components';
import './index.css';
// Импортируем все картинки
import tank_image from './assets/images/tank.png';
import shield from './assets/images/antivirus.png';
import health from './assets/images/like.png';
import bullets from './assets/images/bullet.png';
import gun_up from './assets/images/gun-up.png';
// Импортируем карту
// import map from './map_0'
import map from './map_1'

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
            maxHealth: 5,
            shield: 0,
            maxShield: 5,
            bullets: 4,
            maxBullets: 5,
            lazerLength: 5,
        },
        tank1Old: {
            from_i: 0,
            from_j: 0,
            to_i: 0,
            to_j: 0,
        },
        tank2: {
            i: 10,
            j: 7,
            angle: 30,
            health: 2,
            maxHealth: 5,
            shield: 0,
            maxShield: 5,
            bullets: 4,
            maxBullets: 5,
            lazerLength: 5,
        },
        tank2Old: {
            from_i: 0,
            from_j: 0,
            to_i: 0,
            to_j: 0,
        },
        lazer1: false,
        lazer2: false,
    }

    // Задаем сторону шестигранника относительно высоты окна. При изменении высоты окна нужно обносвить страницу.
    hexSide = ((window.innerHeight * 0.9) / 12).toFixed(2) * 0.61

    componentDidMount () {
        // componentDidMount - метод React.Component, который срабатывает при загрузке компонента

        // Создаем локацию 12*12 в виде квадратной таблицы. Все поля сущесвуют и пусты
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
        // Создаем стены, аптечки, броню, заряды для лазера на поле, убираем нектоорые клетки
        for (let i in map.disabled) {
            location[map.disabled[i][0]][map.disabled[i][1]].disabled = true
        }
        for (let i in map.walls) {
            location[map.walls[i][0]][map.walls[i][1]].walls = true
        }
        for (let i in map.health) {
            location[map.health[i][0]][map.health[i][1]].health = true
        }
        for (let i in map.shield) {
            location[map.shield[i][0]][map.shield[i][1]].shield = true
        }
        for (let i in map.bullets) {
            location[map.bullets[i][0]][map.bullets[i][1]].bullets = true
        }
        for (let i in map.gunUp) {
            location[map.gunUp[i][0]][map.gunUp[i][1]].gunUp = true
        }

        this.setState({
            tank1: map.tanks[0],
            tank2: map.tanks[1],
            location: location
        })
    }

    getCoordinatesByIndexes = (i, j) => {
        // Функция возвращает по индексам шестигранника его абсолютные координаты x и y
        let x = (j + 1) * Math.sqrt(3) * this.hexSide + 1 * j - this.hexSide
        let y = (1.5 * i + 1) * +this.hexSide + 1.3 * i - this.hexSide
        // Если строка четная - координата x рассчитывается иначе
        if (i % 2 === 0) {
            x = (j * 2 + 1) * Math.sqrt(3) * 0.5 * this.hexSide + 1 * j - this.hexSide
        }
        // Возвращается объек из двух полей - соответствуюзих координат округленных до целого
        // и преобразованных в число (x = +("1") <==> x = parseInt("1"))
        return ({
            x: +x.toFixed(0),
            y: +y.toFixed(0)
        })
    }

    sideBar = (player) => {
        // Функция отрисовывает белую полосу с данными игрока, принимая на вход номер игрока
        let oneRow = (currentValue, maxValue, image, color) => {
            // Функция отрисовывает полосу с иконкой, полосой состояния переменной, и ее числовое значение
            return (
                <Container width={20} height={5} backgroundColor={`white`} row={true} >
                    {/*Иконка слева*/}
                    <Container width={30} widthUnit={`px`} height={30} heightUnit={`px`} backgroundImage={image} backgroundColor={`white`} />
                    <Container width={10} height={5} backgroundColor={`white`} >
                        {/*Полоса с состояние состоит из двух частей - одна закрашена(слева) вторая прозрачная(справа), суммарной длины в полосу в которую помещены(серую)*/}
                        {/*Сервая полоса*/}
                        <Container width={10} height={2} backgroundColor={`lightgrey`} borderRadius={2} row={true} >
                            {/*Левая, закрашенная, полоса*/}
                            <Container width={10 * currentValue / maxValue} height={2} backgroundColor={color} borderRadius={2} />
                            {/*Правая, прозрачная, полоса*/}
                            <Container width={10 * (1 - currentValue / maxValue)} height={2} backgroundColor={`transparent`} borderRadius={2} />
                            </Container>
                    </Container>
                    {/*Цифровое значение*/}
                    <Container width={3} height={5} backgroundColor={`white`} >
                        {currentValue} / {maxValue}
                    </Container>
                </Container>
            )
        }
        let { tank1, tank2 } = this.state
        // Изначально работаем в спервым лазером
        let tank = tank1
        // Если это лазер второго - работаем со вторым лазером
        if (player === 1) {
            tank = tank2
        }
        let mainTab = (
            <div>
                {oneRow(tank.health, tank.maxHealth, health, `red`)}
                {oneRow(tank.shield, tank.maxShield, shield, `blue`)}
                {oneRow(tank.bullets, tank.maxBullets, bullets, `orange`)}
            </div>
        )
        let deadTab = (
            <Container width={20} height={10} backgroundColor={`white`} >
                Танк игрока {player + 1} вышел из строя.
            </Container>
        )
        return (
            <Container width={20} height={100} backgroundColor={`white`} >
                <Container width={20} height={10} backgroundColor={`white`} >
                    Игорк {player + 1}
                </Container>
                {
                    tank.health === 0 ? deadTab : mainTab
                }
            </Container>
        )
    }

    hex = (x, y, color, image) => {
        // Функция возвращает шестигранник расположенный в абсолюьных координатах x и y, окрасив его в цвет color,
        // и вставив картинку image, если ее передали, иначе адрес картинки будет undefined, и просто будет пусто

        // Весь шестигранник состоит из трех полос:
        // - Два прямоугольных треугольника с углами 30 градусов, правый зеркально отображает левый, гипотенуза равна
        // стороне шестигранника
        // - Прямоугольник длиной стороны шестиграннника умножить на корень из 3 и высоты стороны шестигранника
        // - Зеркальное отображение вниз первого слоя
        return (
            //Тело шестигранника
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
                {/*Первый слой*/}
                <Container
                    width={this.hexSide * Math.sqrt(3)}
                    widthUnit={'px'}
                    height={this.hexSide / 2}
                    heightUnit={`px`}
                    backgroundColor={`transparent`}
                    row={true}
                >
                    {/*Левый треугольник*/}
                    <Triangle
                        width={this.hexSide}
                        color={color}
                    />
                    {/*Правый треугольник*/}
                    {/*Отображение зеркально относительно вертикали - transform={`matrix(-1, 0, 0, 1, 0, 0)`}*/}
                    <Triangle
                        width={this.hexSide}
                        color={color}
                        transform={`matrix(-1, 0, 0, 1, 0, 0)`}
                    />
                </Container>
                {/*Второй слой - прямоугольник*/}
                <Container
                    width={this.hexSide * Math.sqrt(3)}
                    widthUnit={`px`}
                    height={this.hexSide}
                    heightUnit={`px`}
                    backgroundColor={color}
                >
                    {/*Квадрат, прозрачный и с картинкой, если она есть*/}
                    <Container
                        width={30}
                        widthUnit={`px`}
                        height={30}
                        heightUnit={`px`}
                        backgroundColor={`transparent`}
                        backgroundImage={image}
                    >

                    </Container>
                </Container>
                {/*Третий слой*/}
                <Container
                    width={this.hexSide * Math.sqrt(3)}
                    widthUnit={'px'}
                    height={this.hexSide / 2}
                    heightUnit={`px`}
                    backgroundColor={`transparent`}
                    row={true}
                >
                    {/*Левый треугольник*/}
                    <Triangle
                        width={this.hexSide}
                        color={color}
                        transform={`matrix(-1, 0, 0, 1, 0, 0) rotate(180deg)`}
                    />
                    {/*Правый треугольник*/}
                    <Triangle
                        width={this.hexSide}
                        color={color}
                        transform={`rotate(180deg)`}
                    />
                </Container>
            </Container>
        )
    }

    checkWall = (i, j) => {
        // Функция проверяем на наличие стены в клетке с координатами [i, j], если эти координаты в пределах массива
        if (this.checkInLocation(i, j)) {
            return this.state.location[i][j].wall
        } else {
            return false
        }
    }

    checkDisable = (i, j) => {
        // Функция проверяем на наличие клетки вцелом с координатами [i, j], если эти координаты в пределах массива
        if (this.checkInLocation(i, j)) {
            return this.state.location[i][j].disabled
        } else {
            return false
        }
    }

    checkHealth = (i, j) => {
        // Функция проверяем на наличие аптечки в клетке с координатами [i, j], если эти координаты в пределах массива
        if (this.checkInLocation(i, j)) {
            return this.state.location[i][j].health
        } else {
            return false
        }
    }

    checkShield = (i, j) => {
        // Функция проверяем на наличие брони в клетке с координатами [i, j], если эти координаты в пределах массива
        if (this.checkInLocation(i, j)) {
            return this.state.location[i][j].shield
        } else {
            return false
        }
    }

    checkBullets = (i, j) => {
        // Функция проверяем на наличие зарядов лазера в клетке с координатами [i, j],
        // если эти координаты в пределах массива
        if (this.checkInLocation(i, j)) {
            return this.state.location[i][j].bullets
        } else {
            return false
        }
    }

    checkGunUp = (i, j) => {
        // Функция проверяем на наличие зарядов лазера в клетке с координатами [i, j],
        // если эти координаты в пределах массива
        if (this.checkInLocation(i, j)) {
            return this.state.location[i][j].gunUp
        } else {
            return false
        }
    }

    checkInLocation = (i, j) => {
        // Функция проверяем координаты [i, j] в пределах массива
        return ((i < 12) && (j < 12) && (i >= 0) && (j >= 0))
    }

    // - Массив keys хранит все класиши движений. Первая половина соответствует первому танку, вторая - второму.
    // - Массив iINC содержит изменение строчной координаты танка в таблице при нажатии на соответствующую клавишу
    // - Массив jINC_0 содержит изменение столбцовой координаты танка в таблице при нажатии на соответствующую клавишу,
    // если строка четная
    // - Массив jINC_1 содержит изменение столбцовой координаты танка в таблице при нажатии на соответствующую клавишу,
    // если строка нечетная
    // - Массив angles содержит угол поворота танка при нажатии на соответствующую клавишу

    keys= [ `w`, `e`, `d`, `x`, `z`, `a` , `i`, `o`, `l`, `,`, `m`, `j` ]
    iINC = [ - 1, - 1, 0, 1, 1, 0 , - 1, - 1, 0, 1, 1, 0 ]
    jINC_0 = [ 1, 0, -1, 0, 1, 1 ,  1, 0, -1, 0, 1, 1 ]
    jINC_1 = [ 0, -1, -1, -1, 0, 1 ,  0, -1, -1, -1, 0, 1 ]
    angles = [-30, 30, 90, 150, 210, 270, -30, 30, 90, 150, 210, 270]

    handleKeyPress = (event) => {
        // Функция сощдает события при нажатии на клавиши
        let { tank1, tank2, lazer1, lazer2, location } = this.state
        // Изначально работаем с первым танком и первывм лазером
        let tank = tank1
        let lazer = lazer1
        // event.key - строка содержащая один символ - нажатая клавиша
        // string.toLowerCase() - опускает все буквы строки в нижний регистр
        // Присваиваем i индекс клавиши в массиве keys
        // array.indexOf(a[1]) = 1, то есть возвращает индекс элемента массива. Если такого нет - возвращает -1.
        let i = this.keys.indexOf(event.key.toLowerCase())
        // Если клавиша из второй половины массива keys - работаем со вторым танком и первым лазером
        if (i > 5) {
            tank = tank2
            lazer = lazer2
        }
        // Если нажатая клавиша ввходит в массив keys, то есть i != -1.
        if (i !== -1) {
            // Присваиваем новые координаты образу текущего состояния танка
            tank = {
                ...tank,
                i: tank.i + this.iINC[i],
                j: tank.j - (tank.i % 2 === 0 ? this.jINC_0[i] : this.jINC_1[i]),
                angle: this.angles[i]
            }
            // Проеряем, если новое поле содержит аптечку - то увеличиваем здоровье, не выходя за максимум,
            // и убираем аптечку с поля, предварительно проверив, что эти индексы не выходят за пределы массива
            let health = tank.health
            if (this.checkHealth(tank.i, tank.j)) {
                tank.health = Math.max(0, Math.min(tank.health + 1, tank.maxHealth))
                location[tank.i][tank.j].health = false
            }
            // Аналогично на наличие брони в клетке
            let shield = tank.shield
            if (this.checkShield(tank.i, tank.j)) {
                tank.shield = Math.max(0, Math.min(tank.shield + 1, tank.maxShield))
                location[tank.i][tank.j].shield = false
            }
            // Аналогично на наличие патронов для лазера в клетке
            let bullets = tank.bullets
            if (this.checkBullets(tank.i, tank.j)) {
                tank.bullets = Math.max(0, Math.min(tank.bullets + 1, tank.maxBullets))
                location[tank.i][tank.j].bullets = false
            }
            // Аналогично на наличие улучшения для лазера для лазера в клетке
            let lazerLength = tank.lazerLength
            if (this.checkGunUp(tank.i, tank.j)) {
                tank.lazerLength = Math.max(0, tank.lazerLength + 1)
                location[tank.i][tank.j].gunUp = false
            }
            // Если новые координаты не выходят за пределы поля, не являются стеной или вообще есть на
            // карте - обновляем state танка
            if (
                (this.checkInLocation(tank.i, tank.j)) &&
                (!this.checkDisable(tank.i, tank.j)) &&
                (!this.checkWall(tank.i, tank.j)) &&
                (!lazer)
            ) {
                // Если клавиша из второй части массива keys, то есть танк второй - обновляем
                // state первого танка и локации
                if (i < 6) {
                    // При этом проверяем что он не въедет во второй танк
                    if (!((tank.i === this.state.tank2.i) && (tank.j === this.state.tank2.j))) {
                        this.setState({
                            tank1: tank,
                            tank1Old: this.state.tank1,
                            location: location
                        })
                    }
                } else {
                    // Иначе - второго танка и локации, при условии что он не въедет в первый танк
                    if (!((tank.i === this.state.tank1.i) && (tank.j === this.state.tank1.j))) {
                        this.setState({
                            tank2: tank,
                            tank2Old: this.state.tank2,
                            location: location
                        })
                    }
                }
            }
        }
        if (event.key.toLowerCase() === `s`) {
            // Если есть заряды лазера - включаем лазер первого танка
            if (this.state.tank1.bullets > 0) {
                this.setState({
                lazer1: true,
                tank1: {
                    ...this.state.tank1,
                    bullets: this.state.tank1.bullets - 1
                }
            })
                // Через 250мсек отключаем лазер первого танка
            setTimeout(() => { this.setState({ lazer1: false }) }, 250)
            }
        }
        if (event.key.toLowerCase() === `k`) {
            // Если есть заряды лазера - включаем лазер второго танка
            if (this.state.tank2.bullets > 0) {
                this.setState({
                lazer2: true,
                tank2: {
                    ...this.state.tank2,
                    bullets: this.state.tank2.bullets - 1
                }
            })
                // Через 250мсек отключаем лазер второго танка
                setTimeout(() => { this.setState({ lazer2: false }) }, 250)
            }
        }
    }

    lazer = (player) => {
        let { tank1, tank2 } = this.state
        // Изначально работаем в спервым лазером
        let tank = tank1
        // Если это лазер второго - работаем со вторым лазером
        if (player === 1) {
            tank = tank2
        }
        // Создаем пустой массив, в который потом будем добавлять индексы клеток на пути лазера
        let array = []
        let { i, j } = tank
        // Добавляем в массив клетку с танков
        array.push({ i: i, j: j })
        // Создаем indexOfMove - равный индексу угла, равному текущему углу танка относительно напревления вверх
        let indexOfMove = this.angles.indexOf(tank.angle)
        // Создаем цикл, по количеством повтором, равным длине лазера танка игрока
        for (let indexOfCycle = 0; indexOfCycle < tank.lazerLength; indexOfCycle++) {
            // Определяем координаты следующей клетки на пути лазера
            j = j - (i % 2 === 0 ? this.jINC_0[indexOfMove] : this.jINC_1[indexOfMove])
            i = i + this.iINC[indexOfMove]
            // Если эта клетка не выходит за пределы массива, не является стеной
            if (
                this.checkInLocation(i, j) &&
                !this.checkWall(i, j)
            ) {
                // То проверяем, попал ли первый во второго
                if (player === 0) {
                    if ((this.state.tank2.i === i) && (this.state.tank2.j === j)) {
                        // Если да - то через 300мсек после выстрела отнимаем здоровье у второго танка
                        setTimeout(() => {
                            this.setState({
                                tank2: {
                                    ...this.state.tank2,
                                    shield: this.state.tank2.shield > 0 ? this.state.tank2.shield - 1 : this.state.tank2.shield,
                                    health:this.state.tank2.shield > 0 ? this.state.tank2.health : Math.max(0, this.state.tank2.health - 1)
                                }
                            })
                        }, 300)
                    }
                } else {
                    // Или второй в первого
                    if ((this.state.tank1.i === i) && (this.state.tank1.j === j)) {
                        // Если да - то через 300мсек после выстрела отнимаем здоровье у первого танка
                        setTimeout(() => {
                            this.setState({
                                tank1: {
                                    ...this.state.tank1,
                                    shield: this.state.tank1.shield > 0 ? this.state.tank1.shield - 1 : this.state.tank1.shield,
                                    health:this.state.tank1.shield > 0 ? this.state.tank1.health : Math.max(0, this.state.tank1.health - 1)
                                }
                            })
                        }, 300)
                    }
                }
                array.push({ i: i, j: j })
                // Если кто-то в кого-то попал - лазер дальше не проходит,
                // и завершаем цикл сделав текущий индекс последним
                if (
                    ((this.state.tank2.i === i) && (this.state.tank2.j === j)) ||
                    ((this.state.tank1.i === i) && (this.state.tank1.j === j))
                ) {
                    indexOfCycle = tank.lazerLength
                }
            } else {
                // Иначе завершаем цикл сделав текущий индекс последним
                indexOfCycle = tank.lazerLength
            }
        }
        // Возвращаем массив шестигранников передавая в каждый координаты и цвет
        return array.map((item, index) => {
            return this.hex(
                this.getCoordinatesByIndexes(item.i, item.j).x,
                this.getCoordinatesByIndexes(item.i, item.j).y,
                `orange`
            )
        })
    }

    tank = (player) => {
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
        let { tank1, tank1Old, tank2, tank2Old } = this.state
        let tank = tank1
        let oldTank = tank1Old
        if (player === 1) {
            tank = tank2
            oldTank = tank2Old
        }
        // Сдвиги по осям для отцентрирования (может плыть на разных экранах)
        let xOffset = this.hexSide * 0.5
        let yOffset = this.hexSide * 0.2
        return (
            <Container
                width={466 / 20}
                widthUnit={`px`}
                height={979 / 20}
                heightUnit={`px`}
                backgroundColor={`trnasparent`}
                backgroundImage={tank_image}
                transform={`rotate(${tank.angle}deg)`}
                absolute={true}
                left={this.getCoordinatesByIndexes(tank.i, tank.j).x + xOffset}
                top={this.getCoordinatesByIndexes(tank.i, tank.j).y + yOffset}
                animation={animation(
                    this.getCoordinatesByIndexes(oldTank.i, oldTank.j).x + xOffset,
                    this.getCoordinatesByIndexes(tank.i, tank.j).x + xOffset,
                    this.getCoordinatesByIndexes(oldTank.i, oldTank.j).y + yOffset,
                    this.getCoordinatesByIndexes(tank.i, tank.j).y + yOffset,
                )}
            >

            </Container>
        )
    }

    render = () => {
        return (
            <Container backgroundColor={`grey`} row={true} >
                {/*Поле ввода, которое покрывает все сверху, и считывает нажатия клавиш. Всегда равно пустому значению. При загруке курсор стоит на нем - autofocus.*/}
                {/*Оно существует, если здоровья обоих танков больше 0*/}
                {
                    +this.state.tank1.health === 0 || +this.state.tank2.health === 0 ? null :
                        <Input type="text" value={""} onKeyPress={this.handleKeyPress} autofocus="true" />
                }
                {/*Левое поле игрока (1)*/}
                {this.sideBar(0)}
                {/*Поле игры*/}
                <Container height={90} widthUnit={`vh`} backgroundColor={`grey`} >
                    {/*Отрисовка шестигранников (клеток)*/}
                    {
                        this.state.location.map((row, i) => {
                            return row.map((column, j) => {
                                // Если клетка на карте задана - задаем ее стили
                                if (!this.checkDisable(i, j)) {
                                    // Находим абсолютные координаты по индексам в таблице
                                    let coordinates = this.getCoordinatesByIndexes(i, j)
                                    // Задаем цвет клетки
                                    let color = `white`
                                    // Если стана - серый
                                    if (this.state.location[i][j].wall) {
                                        color = `lightgrey`
                                    }
                                    // Создаем пустую картинку
                                    let image = undefined
                                    // Если в поле есть аптечка - передаем в картинку иконку сердца
                                    if (this.checkHealth(i, j)) {
                                        image = health
                                    }
                                    // Если в поле есть щит - передаем в картинку иконку щита
                                    if (this.checkShield(i, j)) {
                                        image = shield
                                    }
                                    // Если в поле есть заряды для лазера - передаем в картинку иконку патронов
                                    if (this.checkBullets(i, j)) {
                                        image = bullets
                                    }
                                    // Если в поле есть аптечка - передаем в картинку иконку сердца
                                    if (this.checkGunUp(i, j)) {
                                        image = gun_up
                                    }
                                    return this.hex(coordinates.x, coordinates.y, color, image)
                                } else {
                                    //Иначе возвращаем null
                                    return null
                                }
                            })
                        })
                    }
                    {/*Лазеры*/}
                    {/*Если соответствующий лазер включен - рисуем то, что возвращает функция this.lazer(player),
                    иначе не рисуем ничего*/}
                    { this.state.lazer1 ? this.lazer(0) : null }
                    { this.state.lazer2 ? this.lazer(1) : null }
                    {/*Танки*/}
                    {/*Рисуем то, что возвращает функция this.tank(player)*/}
                    { this.tank(0) }
                    { this.tank(1) }
                </Container>
                {/*Правое поле игрока (2)*/}
                {this.sideBar(1)}
            </Container>
        )
    }
}

export default (App)