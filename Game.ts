///<reference path="Sneak.ts"/>
///<reference path="View.ts"/>
module sneak {
    export enum Direction{
        UP, DOWN, LEFT, RIGHT
    }

    /**
     * Модель точки
     */
    export class Point {
        x:number;
        y:number;

        constructor(x:number, y:number) {
            this.x = x;
            this.y = y;
        }

        isEqual(point:Point) {
            return this.x == point.x && this.y == point.y;
        }
    }

    /**
     * Игровое поле
     */
    export class Field {
        width = 20;
        height = 20;

        /**
         * Находится ли точка за пределами филда
         */
        isOutside(point:Point) {
            return point.x >= this.width || point.x < 0 || point.y < 0 || point.y >= this.width;
        }

        /**
         * Генерит случайную точку
         */
        getRandomPoint() {
            var x = Math.floor(Math.random() * this.width);
            var y = Math.floor(Math.random() * this.height);
            return new Point(x, y);
        }
    }


    /**
     * Модель игры
     */
    export class Game {
        nextFood:Point; // след кусок еды
        field = new Field();
        sneak:Sneak;
        view:View;
        interval = 200;

        constructor(rootNode:HTMLElement) {
            this.view = new View(this, rootNode);
            this.init();
        }

        init() {
            this.sneak = new Sneak(this.field);
            this.createFood();
            this.step();
        }

        /**
         * Очередной шаг игры
         */
        step() {
            if (this.sneak.moveNext()) {
                if (this.sneak.isCrossed(this.nextFood)) {
                    this.sneak.eat(this.nextFood);
                    this.createFood();
                }
                this.updateView();
                setTimeout(()=>this.step(), this.interval);
            }
            else {
                this.view.showLost();
            }
        }

        updateView() {
            this.view.update(this.sneak.points.concat(this.nextFood));
        }

        /**
         * Создать еду
         */
        createFood() {
            while (true) {
                this.nextFood = this.field.getRandomPoint();
                if (this.sneak.points.every(point => !this.nextFood.isEqual(point))) {
                    break;
                }
            }
        }

        reset() {
            this.init();
            this.view.reset();
        }
    }
}
